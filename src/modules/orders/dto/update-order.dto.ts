import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderStatus } from "../enum/order-status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status data',
    example: { status: 'confirmed' },
  })
  @IsNotEmpty({ message: "Order status is required" })
  @IsEnum(OrderStatus, { message: "Invalid order status" })
  public status: string; 
}
