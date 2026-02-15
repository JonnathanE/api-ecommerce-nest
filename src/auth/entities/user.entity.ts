import { Product } from 'src/products/entities';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'c5f2a71b-4d1e-4a3f-9b2d-1e8c7f3a5b9d',
    description: 'Unique identifier of the user.',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address used for authentication.',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User encrypted password. Not returned in queries by default.',
    writeOnly: true,
  })
  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user.',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the user account is active.',
    default: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'Roles assigned to the user for authorization purposes.',
    isArray: true,
    default: ['user'],
  })
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @ApiProperty({
    description: 'Products created by this user.',
    type: () => Product,
    isArray: true,
  })
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
