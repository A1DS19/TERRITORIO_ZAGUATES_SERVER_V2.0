import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { PaginatedUsers, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { IsValidID } from 'src/pipes/is-valid-id.pipe';
import { AuthGuard } from 'src/auth/guards/isAuth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/isAdmin.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { _idTransformInterceptor } from 'src/interceptors/_id-transform.interceptor';

export type Msg = {
  msg: string;
};
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll(@Query('page') page: string): Promise<PaginatedUsers> {
    return await this.usersService.findAll(page);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id', new IsValidID()) id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Get('/cedula/:cedula')
  async findByCedula(@Param('cedula') cedula: string): Promise<PaginatedUsers> {
    return await this.usersService.findByCedula(cedula);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id', new IsValidID()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', new IsValidID()) id: string): Promise<User> {
    return await this.usersService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Patch('/reset-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() body: ResetPasswordDto,
  ): Promise<Msg> {
    return this.usersService.resetPassword(id, body);
  }

  @UseGuards(AdminGuard)
  @Patch('/reset-password-admin/:id')
  async resetPasswordAdmin(@Param('id') id: string): Promise<Msg> {
    return this.usersService.resetPaswordAdmin(id);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(AuthGuard)
  @Patch('/add-favorite-pets/:userId/:petId/:exists')
  async addFavoritePet(
    @Param('userId', new IsValidID()) userId: string,
    @Param('petId', new IsValidID()) petId: string,
    @Param('exists') exists: string,
  ): Promise<User> {
    return await this.usersService.addFavoritePet(userId, petId, exists);
  }

  @UseGuards(AuthGuard)
  @Get('/get-favorite-pets/:userId')
  async getFavoritePets(
    @Param('userId', new IsValidID()) userId: string,
  ): Promise<User> {
    return this.usersService.getFavoritePets(userId);
  }
}
