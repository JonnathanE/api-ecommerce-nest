import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Param,
  Get,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  @ApiOperation({
    summary: 'Get product image',
    description: 'Retrieves a product image by its filename.',
  })
  @ApiParam({
    name: 'imageName',
    description: 'The filename of the product image',
    example: 'product_12345678.jpg',
  })
  @ApiResponse({
    status: 200,
    description: 'Image retrieved successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid image name.',
  })
  @ApiResponse({
    status: 404,
    description: 'Image not found.',
  })
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('product')
  @ApiOperation({
    summary: 'Upload product image',
    description:
      'Uploads a new product image. Only image files (jpg, jpeg, png, gif) are accepted.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully.',
    schema: {
      type: 'object',
      properties: {
        secureUrl: {
          type: 'string',
          example: 'http://localhost:3000/files/product/product_12345678.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. File is not an image or no file provided.',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureUrl };
  }
}
