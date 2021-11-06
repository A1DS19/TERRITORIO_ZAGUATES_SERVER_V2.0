import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, cedula } = createUserDto;
    await this.uniqueEmailCedula(email, cedula);

    const hashedPassword = await argon2.hash(password);

    createUserDto.password = hashedPassword;

    const user = await this.userModel.create(createUserDto);

    if (!user) {
      throw new BadRequestException('No se pudo crear usuario');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();

    if (!users) {
      throw new NotFoundException('No hay usuarios');
    }
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('No hay usuario');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto)
      .exec();
    if (!user) {
      throw new NotFoundException('Usuario no existe, no se puedo modificar');
    }

    return user;
  }

  async remove(id: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { status: 0 })
      .exec();

    if (!user) {
      throw new NotFoundException('Usuario no existe, no se puede eliminar');
    }

    return user;
  }

  private async uniqueEmailCedula(
    email: string,
    cedula: string,
  ): Promise<void> {
    const emailUser = await this.userModel.find({ email }).exec();

    if (emailUser.length > 0) {
      throw new BadRequestException(`El email ${email} ya existe`);
    }

    const cedulaUser = await this.userModel.find({ cedula }).exec();

    if (cedulaUser.length > 0) {
      throw new BadRequestException(`La cedula ${cedula} ya existe`);
    }
  }
}
