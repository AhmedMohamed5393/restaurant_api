import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OrdersService } from '../orders/orders.service';
import { IReport } from 'src/interfaces/report.interface';

@Injectable()
export class ReportsService {
  private key = 'report';
  private ttl = 24 * 60 * 60 * 1000;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => OrdersService)) private orderService: OrdersService,
  ) { }

  public async getDailyReport() {
    const data = await this.orderService.getOrdersStatistics();

    return { data };
  }

  public async get(): Promise<{ data: IReport }> {
    const data: IReport = await this.cacheManager.get(this.key);

    return { data };
  }

  public async set(report: IReport): Promise<void> {
    let payload: IReport;

    const data: IReport = await this.cacheManager.get(this.key);
    if (!data) payload = report;
    else {
      data.no_of_orders = report.no_of_orders || data.no_of_orders;
      if (+report.total_revenue) data.total_revenue += report.total_revenue;
      if (report.top_selling_items?.length) {
        data.top_selling_items = data.top_selling_items.concat(report.top_selling_items);
      }

      payload = data;
    }

    await this.cacheManager.set(this.key, payload, this.ttl);
  }
}
