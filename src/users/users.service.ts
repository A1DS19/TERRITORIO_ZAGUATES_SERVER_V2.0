import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import * as argon2 from 'argon2';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Msg } from './users.controller';

export type PaginatedUsers = {
  users: User[];
  totalPages: number;
};

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto | RegisterDto): Promise<User> {
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

  async findAll(page: string): Promise<PaginatedUsers> {
    const limit = 10;
    const totalUsers = await this.userModel.countDocuments();

    const users = await this.userModel
      .find()
      .where('status')
      .equals(1)
      .limit(limit * 1)
      .skip(+page * limit)
      .sort({ createdAt: -1 });

    if (!users) {
      throw new NotFoundException('No hay mascotas');
    }

    return { users, totalPages: Math.ceil(totalUsers / limit) };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('No hay usuario');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('Datos invalidos');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, cedula } = updateUserDto;

    const probableUser = await this.userModel.find({
      $or: [{ email }, { cedula }],
    });

    if (probableUser.length > 0 && probableUser[0]._id.toString() !== id) {
      if (probableUser[0].email === email) {
        throw new BadRequestException(`Email ${email} ya existe`);
      }

      if (probableUser[0].cedula === cedula) {
        throw new BadRequestException(`Cedula ${cedula} ya existe`);
      }
    }

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

  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<Msg> {
    const { newPassword: password, oldPassword } = resetPasswordDto;
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const validPassword = await argon2.verify(user.password, oldPassword);

    if (!validPassword) {
      throw new UnauthorizedException('Contraseñas no concuerdan');
    }

    const newPassword = await argon2.hash(password);

    user.password = newPassword;

    await user.save();

    return { msg: 'Contraseña reseteada' };
  }

  async findByCedula(cedula: string): Promise<PaginatedUsers> {
    const user = await this.userModel.find({ cedula });

    if (!user) {
      throw new NotFoundException(`Usuario con cedula ${cedula} no existe`);
    }

    return { users: user, totalPages: 0 };
  }

  async resetPaswordAdmin(id: string): Promise<Msg> {
    const user = await this.userModel.findByIdAndUpdate(id, {
      password: await argon2.hash('abcde12345'),
    });

    if (!user) {
      throw new NotFoundException('Usuario no existe');
    }

    return { msg: 'Nueva contrasena es "abcde12345"' };
  }

  async addFavoritePet(
    userId: string,
    petId: string,
    exists: string,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('Datos invalidos');
    }

    if (!JSON.parse(exists)) {
      user.wishlist.push(petId);
    } else {
      user.wishlist = user.wishlist.filter((x) => x.toString() !== petId);
    }

    await user.save();

    return user;
  }

  async getFavoritePets(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .populate('wishlist')
      .select('wishlist');

    if (!user) {
      throw new BadRequestException('Datos invalidos');
    }

    return user;
  }

  private async uniqueEmailCedula(
    email: string,
    cedula: string,
  ): Promise<void> {
    const emailUser = await this.userModel.find({ email, status: 1 }).exec();

    if (emailUser.length > 0) {
      throw new BadRequestException(`El email ${email} ya existe`);
    }

    const cedulaUser = await this.userModel.find({ cedula, status: 1 }).exec();

    if (cedulaUser.length > 0) {
      throw new BadRequestException(`La cedula ${cedula} ya existe`);
    }
  }
}
