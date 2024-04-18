import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { OrderStatus } from './enum/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private productService: ProductsService,
  ) {}

  public async create(createOrderDto: CreateOrderDto) {
    try {
      // map selected products ids with check
      const products_ids = createOrderDto.products.map((product) => product._id);
      const products = await this.productService.checkExistenceOfProductsByIds(products_ids);
      if (!products.length) {
        throw new UnprocessableEntityException('No products found');
      }

      let total = 0;
      for (const product of products) {
        const foundProduct = createOrderDto.products.find(
          (item) => {
            return item._id === product._id.toString() && item.quantity > product.quantity;
          },
        );
        if (!foundProduct) continue;

        total += product.price;
      }

      // count all orders to generate order number
      const count = await this.orderModel.countDocuments();

      // prepare order payload for insertion
      const newOrder = new Order();
      newOrder.order_no = `#${count + 1}`;
      newOrder.total = total;
      newOrder.customer = createOrderDto.customer;
      newOrder.products = products;
      newOrder.status = OrderStatus.pending;

      const order = await this.orderModel.create(newOrder);

      return { message: 'Order is created successfully', data: order };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while creating order');
    }
  }

  public async findAll(page: number, limit: number) {
    try {
      const skip = page - 1 > 0 ? limit * (page - 1) : 0;
      const orders = await this.orderModel.find()
                             .select(['_id', 'total', 'customer.name', 'customer.email'])
                             .skip(skip)
                             .limit(limit)
                             .sort({ created_at: 'desc' })
                             .populate('products', '_id')
                             .exec();
      const data = orders.map((order) => {
        order.products = order.products.length as number as any;
        return order;
      });
  
      return { data, page };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while fetching orders list');
    }
  }

  public async findOne(id: string) {
    try {
      const data = await this.orderModel.findById(id).populate('products').exec();
      if (!data._id) {
        throw new UnprocessableEntityException('This order not found');
      }
      
      return { message: 'Order is deleted successfully' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while fetching this order')
    }
  }

  public async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const data = await this.orderModel.findByIdAndUpdate(id, updateOrderDto);
      if (!data._id) {
        throw new UnprocessableEntityException('This order not found');
      }
      
      return { message: `Order status is changed to ${data.status} successfully` };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while updating status of this order')
    }
  }

  public async remove(id: string) {
    try {
      const data = await this.orderModel.findByIdAndDelete(id);
      if (!data._id) {
        throw new UnprocessableEntityException('This order not found');
      }
      
      return { message: 'Order is deleted successfully' };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Error while deleting this order')
    }
  }
}
