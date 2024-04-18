import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './modules/orders/orders.module';
import { ReportsModule } from './modules/reports/reports.module';
import { ProductsModule } from './modules/products/products.module';
import { MONGODB_URL } from './config/environment';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL),
    OrdersModule,
    ReportsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
