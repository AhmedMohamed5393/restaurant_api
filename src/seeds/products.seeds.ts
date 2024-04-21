import { Command } from 'nestjs-command';
import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../modules/products/products.service';

@Injectable()
export class ProductsSeed {
constructor(private readonly productsService: ProductsService) {}

@Command({ command: 'create:products', describe: 'create several products' })
    public async create() {
        const products = await this.productsService.findAll();
        if (!products.data.length) Logger.debug('Products already exists');

        const payload = [
            { name: 'Fried Chicken (Prosted)', price: 200, quantity: 5 },
            { name: 'Fatta Shawerma', price: 120, quantity: 20 },
            { name: 'Grilled Chicken', price: 225, quantity: 2 },
            { name: 'Arabic Shawerma', price: 170, quantity: 25 },
            { name: 'Fried Cheese', price: 50, quantity: 10 },
            { name: 'Shiitake Mushroom', price: 265, quantity: 15 },
            { name: 'Chicken Buster', price: 130, quantity: 20 },
            { name: 'Bacon Mushroom', price: 180, quantity: 15 },
            { name: 'Old School', price: 140, quantity: 30 },
            { name: 'The Secret Burger', price: 290, quantity: 10 },
        ];
        
        try {
            await this.productsService.create(payload);
            Logger.debug('Products are seeded successfully');
        } catch (error) {
            Logger.error(error);   
        }
    }
}
