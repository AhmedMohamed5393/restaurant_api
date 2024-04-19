import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('reports')
@ApiTags('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @ApiOperation({ description: 'Get Daily sales report' })
  @ApiOkResponse({ description: 'Required report data' })
  @Get()
  public findDailySalesReport() {
    return this.reportsService.getDailyReport();
  }

  @ApiOperation({ description: 'Generate Daily sales report' })
  @ApiOkResponse({ description: 'Required report data' })
  @Get('generate')
  public generateDailySalesReport() {
    return this.reportsService.get();
  }
}
