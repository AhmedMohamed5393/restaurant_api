import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ description: 'Create new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiCreatedResponse({ description: 'Order is created successfully' })
  @ApiUnprocessableEntityResponse({ description: 'No products found' })
  @Post()
  public create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ description: 'Get all clients' })
  @ApiOkResponse({ description: 'Clients list' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Get()
  public findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.ordersService.findAll(page, limit);
  }

  @ApiOperation({ description: 'Get client by ID' })
  @ApiOkResponse({ description: 'Required client data' })
  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ description: 'Update order status data' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ description: 'Order status is changed to confirmed successfully' })
  @ApiUnprocessableEntityResponse({ description: 'This order not found' })
  @Patch(':id')
  public update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ description: 'Delete order' })
  @ApiOkResponse({ description: 'order is deleted successfully' })
  @ApiUnprocessableEntityResponse({ description: 'order not found' })
  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
