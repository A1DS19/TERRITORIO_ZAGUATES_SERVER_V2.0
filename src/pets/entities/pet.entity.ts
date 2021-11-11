import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type PetDocument = Pet & Document;

@Schema({ timestamps: true, id: true })
export class Pet {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  breed: string;

  @Prop({ type: String, default: 'false' })
  adopted: string;

  @Prop({ type: [String], default: [] })
  photosUrl: string[];

  @Prop({ type: String })
  description: string;

  @Prop({ type: String, default: 'pequeño' })
  size: string;

  @Prop({ type: Date, default: new Date() })
  adoptionDate: string;

  @Prop({ type: String })
  adoptionPlace: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  adopteeId: string;

  @Prop({ type: String })
  employee: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: Date })
  followUpDate: Date;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
