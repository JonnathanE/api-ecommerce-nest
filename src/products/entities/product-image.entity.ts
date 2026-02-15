import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImage {
  @ApiProperty({
    example: 1,
    description: 'Unique identifier of the product image.',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'nike_air_max_01.jpg',
    description: 'Image file name or URL path.',
  })
  @Column('text')
  url: string;

  @ApiProperty({
    description: 'Product associated with this image.',
    type: () => Product,
  })
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
