import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Pet } from 'src/pets/entities/pet.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true, id: true })
export class User {
  @Prop({ required: true, unique: true, type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  displayName: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, default: 'false' })
  isAdmin: string;

  @Prop({ type: String })
  photoUrl: string;

  @Prop({ type: String })
  direction: string;

  @Prop({ type: Number, default: 1 })
  status: number;

  @Prop({ type: String })
  cedula: string;

  @Prop({ type: String })
  phone: string;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        default: [],
      },
    ],
  })
  wishlist: string[];

  @Prop({ type: String, default: 'false' })
  donation: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
