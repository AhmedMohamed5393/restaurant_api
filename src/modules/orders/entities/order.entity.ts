import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderStatus } from '../enum/order-status.enum';
import { Product } from 'src/modules/products/entities/product.entity';
import { IPurchasedItem } from 'src/interfaces/purchased-item.interface';

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
      OrderStatus.confirmed,
      OrderStatus.cancelled,
    ],
  })
  public status: string;

  @Prop({ type: Object, required: true })
  public customer: ICustomerDetails;

  @Prop({ type: Array<Object>, required: true })
  public purchased_items: IPurchasedItem[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }] })
  public products: Product[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
