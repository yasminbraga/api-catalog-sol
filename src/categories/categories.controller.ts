import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RequestCategoryDto } from './dto/request-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() requestCategoryDto: RequestCategoryDto) {
    return this.categoriesService.create(requestCategoryDto);
  }
}
