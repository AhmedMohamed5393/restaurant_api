import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [OrdersModule, CustomersModule, ReportsModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
