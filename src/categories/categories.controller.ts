import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<CreateCategoryDto>,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Get(':id/products')
  async findCategoryProducts(@Param('id') id: string) {
    return this.categoriesService.findCategoryProducts(id);
  }

  @Get(':id/products/pdf')
  async generatePdf(@Res() res: Response, @Param('id') id: string) {
    const pdf = await this.categoriesService.generatePdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=produtos.pdf',
    });

    res.end(pdf);
  }
}
