import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: 'products' })
export class Product {
  @Prop({ required: true, type: String })
  public name: string;

  @Prop({ required: true, type: Number })
  public price: number;

  @Prop({ required: true, type: Number, min: 1 })
  public quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
