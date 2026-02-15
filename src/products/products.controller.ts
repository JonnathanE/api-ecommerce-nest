import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities';
// import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Creates a new product in the catalog. Requires authentication.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created.',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: User) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves a paginated list of products.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
    type: [Product],
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiOperation({
    summary: 'Get product by term',
    description:
      'Retrieves a single product by ID, title, or slug (case insensitive).',
  })
  @ApiParam({
    name: 'term',
    description: 'Product UUID, title, or slug',
    example: 'a7f9df61-3d0b-4b5a-8b47-0f45fb2b2a6d',
  })
  @ApiResponse({
    status: 200,
    description: 'Product found successfully.',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Updates an existing product. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    format: 'uuid',
    example: 'a7f9df61-3d0b-4b5a-8b47-0f45fb2b2a6d',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated.',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid UUID or input data.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a product from the catalog. Requires authentication.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    format: 'uuid',
    example: 'a7f9df61-3d0b-4b5a-8b47-0f45fb2b2a6d',
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid UUID.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
