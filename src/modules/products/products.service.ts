import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  public async checkExistenceOfProductsByIds(ids) {
    return await this.productModel.find({ _id: { $in: ids } }).select(['_id', 'price', 'quantity']).exec();
  }
}
