import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Msg } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet, PetDocument } from './entities/pet.entity';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type PaginatedPets = {
  pets: Pet[];
  totalPages: number;
};

export type PetStatus = 'all' | 'adopted';

@Injectable()
export class PetsService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private usersService: UsersService,
  ) {}

  async create(createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petModel.create(createPetDto);
  }

  async findAll(page: string): Promise<PaginatedPets> {
    const limit = 10;
    const totalPets = await this.petModel.countDocuments();

    const pets = await this.petModel
      .find()
      .where('status')
      .equals(1)
      .limit(limit * 1)
      .skip(+page * limit)
      .sort({ createdAt: -1 });

    if (!pets) {
      throw new NotFoundException('No hay mascotas');
    }

    return { pets, totalPages: Math.ceil(totalPets / limit) };
  }

  async findAdoptedPets(page: string): Promise<PaginatedPets> {
    const limit = 10;
    const totalPets = await this.petModel.countDocuments();

    const pets = await this.petModel
      .find()
      .where('status')
      .equals(1)
      .where('adopted')
      .equals('true')
      .populate('adopteeId')
      .limit(limit * 1)
      .skip(+page * limit)
      .sort({ createdAt: -1 });

    if (!pets) {
      throw new NotFoundException('No hay mascotas');
    }

    return { pets, totalPages: Math.ceil(totalPets / limit) };
  }

  async updateFollowUpDate(id: string): Promise<Pet> {
    const date = new Date();
    const pet = await this.petModel.findByIdAndUpdate(
      id,
      {
        followUpDate: new Date(date.setMonth(date.getMonth() + 1)),
      },
      { new: true },
    );

    if (!pet) {
      throw new NotFoundException('No hay mascotas');
    }

    return pet;
  }

  async findOne(id: string): Promise<Pet> {
    const pet = await this.petModel.findById(id);

    if (!pet) {
      throw new NotFoundException('Mascota no existe');
    }

    return pet;
  }

  async findByName(name: string, status: PetStatus): Promise<Pet[]> {
    let pets: Pet[];

    if (status === 'adopted') {
      pets = await this.petModel
        .find({
          $and: [
            { name: { $regex: RegExp(name), $options: 'i' } },
            { status: 1 },
            { adopted: 'true' },
          ],
        })
        .populate('adopteeId');
    } else {
      pets = await this.petModel.find({
        $and: [
          { name: { $regex: RegExp(name), $options: 'i' } },
          { status: 1 },
        ],
      });
    }

    if (pets.length === 0 || !pets) {
      throw new NotFoundException(`No hay mascotas con el nombre ${name}`);
    }

    return pets;
  }

  async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.petModel.findById(id);

    if (!pet) {
      throw new NotFoundException('Mascota no existe');
    }

    if (updatePetDto.adopted === 'true') {
      console.log('update');

      const date = new Date();
      const user = await this.usersService.findByCedula(updatePetDto.adopteeId);

      delete updatePetDto.adopteeId;

      const update = {
        adopteeId: (user as any)._id,
        followUpDate: new Date(date.setMonth(date.getMonth() + 1)),
        ...updatePetDto,
      };

      return await this.petModel.findByIdAndUpdate(id, update as any);
    }

    return await this.petModel.findByIdAndUpdate(id, updatePetDto as any);
  }

  async remove(id: string): Promise<Msg> {
    const pet = await this.petModel.findByIdAndUpdate(id, { status: 0 });

    if (!pet) {
      throw new NotFoundException('Mascota no existe');
    }

    return { msg: 'Mascota eliminada' };
  }
}
