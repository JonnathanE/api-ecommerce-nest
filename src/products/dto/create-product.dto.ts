import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title shown in the catalog.',
    example: 'Nike Air Max T-Shirt',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Unit price of the product in decimal format.',
    example: 99.99,
    type: Number,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Detailed product description.',
    example: 'High-quality t-shirt featuring the iconic Nike Air Max logo.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description:
      'URL-friendly slug. If not provided, it will be automatically generated from the title.',
    example: 'nike_air_max_t-shirt',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Available inventory units.',
    example: 100,
    type: Number,
    minimum: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Available sizes for the product.',
    example: ['S', 'M', 'L', 'XL'],
    type: [String],
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Target audience gender category.',
    example: 'men',
    enum: ['men', 'women', 'unisex', 'kid'],
  })
  @IsIn(['men', 'women', 'unisex', 'kid'])
  gender: string;

  @ApiPropertyOptional({
    description: 'Tags used to categorize and search products.',
    example: ['sports', 'casual'],
    type: [String],
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Image file names or URLs for the product.',
    example: ['nike_air_max_01.jpg', 'nike_air_max_02.jpg'],
    type: [String],
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
