import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/products.entity';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, file);
  }

  @Get(':categoryId')
  async getAllByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findAllByCategory(categoryId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: Partial<Product>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, file);
  }
}
