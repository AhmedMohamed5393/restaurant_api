import { Module, forwardRef } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { REDIS_HOST, REDIS_PORT_NUMBER } from 'src/config/environment';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      port: REDIS_PORT_NUMBER,
      host: REDIS_HOST,
      no_ready_check: false,
    }),
    forwardRef(() => OrdersModule),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule { }
