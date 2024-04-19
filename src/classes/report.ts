import { IReport } from "src/interfaces/report.interface";

export class Report implements IReport {
  public no_of_orders: number;
  public total_revenue: number;
  public top_selling_items: any[];

  constructor (no_of_orders: number, total_revenue: number, top_selling_items: any[]) {
    this.no_of_orders = no_of_orders;
    this.total_revenue = total_revenue;
    this.top_selling_items = top_selling_items;
  }
}
