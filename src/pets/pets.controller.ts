import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginatedPets, PetsService, PetStatus } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/isAdmin.guard';
import { Pet } from './entities/pet.entity';
import { IsValidID } from 'src/pipes/is-valid-id.pipe';
import { Msg } from 'src/users/users.controller';
import { _idTransformInterceptor } from 'src/interceptors/_id-transform.interceptor';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  async create(@Body() createPetDto: CreatePetDto): Promise<Pet> {
    return await this.petsService.create(createPetDto);
  }

  @Get()
  async findAll(@Query('page') page: string): Promise<PaginatedPets> {
    return await this.petsService.findAll(page);
  }

  @UseInterceptors(_idTransformInterceptor)
  @Get('/id/:id')
  async findOne(@Param('id', new IsValidID()) id: string): Promise<Pet> {
    return await this.petsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/pet/get-by-name/:name')
  async findByName(
    @Param('name') name: string,
    @Query('status') status: PetStatus,
  ): Promise<Pet[]> {
    return await this.petsService.findByName(name, status);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/pet/adopted-pets')
  async findAdoptedPets(@Query('page') page: string): Promise<PaginatedPets> {
    return await this.petsService.findAdoptedPets(page);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(
    @Param('id', new IsValidID()) id: string,
    @Body() updatePetDto: UpdatePetDto,
  ): Promise<Pet> {
    return await this.petsService.update(id, updatePetDto);
  }

  @UseInterceptors(_idTransformInterceptor)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/pet/update-followUpDate/:id')
  async updateFollowUpDate(
    @Param('id', new IsValidID()) id: string,
  ): Promise<Pet> {
    return await this.petsService.updateFollowUpDate(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id', new IsValidID()) id: string): Promise<Msg> {
    return await this.petsService.remove(id);
  }
}
