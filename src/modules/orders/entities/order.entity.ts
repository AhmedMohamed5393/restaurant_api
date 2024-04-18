import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { OrderStatus } from '../enum/order-status.enum';
import { Product } from 'src/modules/products/entities/product.entity';

export type OrderDocument = HydratedDocument<Order>;

interface ICustomerDetails {
  name: string;
  address: string;
  email: string;
}

@Schema({ timestamps: true, collection: 'orders' })
export class Order {
  @Prop({ required: true, type: Number })
  public total: number;

  @Prop({ required: true, type: String })
  public order_no: string;

  @Prop({
    default: OrderStatus.pending,
    type: String,
    enum: [
      OrderStatus.pending,
      OrderStatus.completed,
      OrderStatus.cancelled,
    ],
  })
  public status: string;

  @Prop({ type: Object, required: true })
  public customer: ICustomerDetails;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }] })
  public products: Product[];

  @Prop({ default: now() })
  public created_at: Date;

  @Prop({ default: now() })
  public updated_at: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
