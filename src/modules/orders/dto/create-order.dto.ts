import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class CustomerDetails {
  @IsNotEmpty({ message: "Customer name is required" })
  @IsString({ message: "Invalid customer name" })
  public name: string;

  @IsNotEmpty({ message: "Customer address is required" })
  @IsString({ message: "Invalid customer address" })
  public address: string;

  @IsNotEmpty({ message: "Customer name is required" })
  @IsEmail()
  public email: string;
}

class ProductDetails {
  @IsNotEmpty({ message: "Product is required" })
  @IsString({ message: "Invalid product" })
  _id: string;

  @IsNotEmpty({ message: "Product quantity is required" })
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer data',
    example: {
      name: 'Ahmed Mohamed',
      email: 'ahmedmohamedalex93@gmail.com',
      address: '15 Muritania st., El Mandara Bahari, Alexandria',
    },
    type: CustomerDetails,
  })
  @IsNotEmpty()
  @Type(() => CustomerDetails)
  public customer: CustomerDetails;

  @ApiProperty({
    description: 'Products data',
    example: [{ _id: '8409327543hdjks.fdjwlfndwll', quantity: 3 }],
    type: Array<String>,
  })
  @IsNotEmpty()
  @Type(() => ProductDetails)
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: "Products are required" })
  public products: ProductDetails[];
}
