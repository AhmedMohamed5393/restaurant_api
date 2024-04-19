import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  public async checkExistenceOfProductsByIds(ids: string[]) {
    return await this.productModel.find({ _id: { $in: ids } }).select(['_id', 'price', 'quantity']).exec();
  }

  public async updateProductsQuantities(payload: any[]) {
    return await this.productModel.bulkSave(payload);
  }

  public async create() {
    const payload = [
      { name: 'Fried Chicken (Prosted)', price: 200, quantity: 5 },
      { name: 'Fatta Shawerma', price: 120, quantity: 20 },
      { name: 'Grilled Chicken', price: 225, quantity: 2 },
    ];

    return await this.productModel.create(payload);
  }

  public async findAll() {
    const data = await this.productModel.find();

    return { data };
  }
}
