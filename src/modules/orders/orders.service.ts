import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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
    // map selected products ids with check
    const products_ids = createOrderDto.products.map((product) => product._id);
    const products = await this.productService.checkExistenceOfProductsByIds(products_ids);
    if (!products.length) {
      throw new UnprocessableEntityException('No products found');
    }

    // calculate total price and update product quantity of order
    let total = 0;
    const selected_products = [];
    const purchased_items = [];
    for (const product of products) {
      const found_product = createOrderDto.products.find(
        (item) => {
          return item._id === product._id.toString() && item.quantity <= product.quantity;
        },
      );
      if (!found_product) continue;

      total += product.price * found_product.quantity;

      const selected_product = product;
      selected_product.quantity -= found_product.quantity;
      selected_products.push(selected_product);

      purchased_items.push({ _id: product._id, quantity: found_product.quantity });
    }

    if (!selected_products.length) {
      throw new UnprocessableEntityException('Exceeds products quantities limitations');
    }

    // count all orders to generate order number
    const count = await this.orderModel.countDocuments();

    // prepare order payload for insertion
    const newOrder = new Order();
    newOrder.order_no = `#${count + 1}`;
    newOrder.total = total;
    newOrder.customer = createOrderDto.customer;
    newOrder.products = selected_products;
    newOrder.purchased_items = purchased_items;

    const order = await this.orderModel.create(newOrder);

    return { message: 'Order is created successfully', data: order };
  }

  public async findAll(page: number, limit: number) {
    const skip = page - 1 > 0 ? limit * (page - 1) : 0;
    const orders = await this.orderModel.find()
                             .select(['_id', 'total', 'customer.name', 'customer.email', 'products'])
                             .skip(skip)
                             .limit(limit)
                             .sort({ created_at: 'desc' });
    const data = orders.map((order: any) => {
      return { ...order._doc, products: order.products.length };
    });

    return { data, page };
  }

  public async findOne(id: string) {
    const data = await this.orderModel.findById(id).populate('products').exec();
    if (!data) {
      throw new UnprocessableEntityException('This order not found');
    }
    
    return { data };
  }

  public async update(id: string, updateOrderDto: UpdateOrderDto) {
    const { pending, cancelled } = OrderStatus;
    // update status if it isn't confirmed
    const where = { $and: [{ _id: id }, { status: { $ne: updateOrderDto.status } }] };
    const data = await this.orderModel.findOneAndUpdate(where, updateOrderDto).populate("products");
    if (!data) {
      throw new UnprocessableEntityException(`Error while changing status`);
    }

    // map purchased items for updating products quantities
    if (updateOrderDto.status != pending) {
      const products = [];
      for (const item of data.purchased_items) {
        const found_product = data.products.find((product) => item._id.toString() === product['_id']?.toString());
        if (!found_product) continue;

        if (updateOrderDto.status == cancelled) {
          found_product.quantity += item.quantity;
        } else {
          found_product.quantity -= item.quantity;
        }

        products.push(found_product);
      }

      this.productService.updateProductsQuantities(products);
    }
    
    return { message: `Order status is changed to ${updateOrderDto.status} successfully` };
  }
}
