import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'a7f9df61-3d0b-4b5a-8b47-0f45fb2b2a6d',
    description: 'Unique identifier of the product.',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Nike Air Max T-Shirt',
    description: 'Product title shown in the catalog.',
    uniqueItems: true,
    minLength: 1,
  })
  @Column('text', { unique: true })
  title: string;

  @ApiProperty({
    example: 99.99,
    description: 'Unit price of the product in decimal format.',
    type: Number,
    minimum: 0,
    default: 0,
  })
  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiPropertyOptional({
    example: 'High-quality t-shirt featuring the iconic Nike Air Max logo.',
    description: 'Detailed product description.',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    example: 'nike_air_max_t-shirt',
    description:
      'URL-friendly slug automatically generated from the product title. Lowercase with spaces replaced by underscores.',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'Available inventory units.',
    type: Number,
    minimum: 0,
    default: 0,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Available sizes for the product.',
    type: [String],
    isArray: true,
    default: [],
  })
  @Column('text', { array: true, default: [] })
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Target audience gender category.',
    enum: ['men', 'women', 'unisex', 'kid'],
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['sports', 'casual'],
    description: 'Tags used to categorize and search products.',
    type: [String],
    isArray: true,
    default: [],
  })
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Product image collection.',
    type: () => ProductImage,
    isArray: true,
    example: [
      {
        id: 1,
        url: 'nike_air_max_01.jpg',
      },
    ],
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({
    description: 'User who created or owns the product record.',
    type: () => User,
  })
  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  //Para saber si el titulo cambió y modificar el slug definimos una variable temporal
  private tempTitle: string = '';

  @AfterLoad()
  checkTitlePost() {
    if (this.title) {
      this.tempTitle = this.title;
    }
  }

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    if (!this.slug || this.tempTitle !== '') this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
