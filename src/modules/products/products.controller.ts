import { Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  public async create() {
    return this.productsService.create();
  }

  @Get()
  public async findAll() {
    return this.productsService.findAll();
  }
}
