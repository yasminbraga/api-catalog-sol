import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestCategoryDto } from './dto/request-category.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }
  async findOne(id: string) {
    return this.categoriesRepository.findOne({ where: { id } });
  }
  async create(requestCategoryDto: RequestCategoryDto): Promise<Category> {
    const categoryData = this.categoriesRepository.create(requestCategoryDto);
    return this.categoriesRepository.save(categoryData);
  }
}
