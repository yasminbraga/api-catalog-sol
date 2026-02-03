import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
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
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Categoria não encontrada');

    return category;
  }
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryData = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(categoryData);
  }

  async update(id: string, createCategoryDto: Partial<CreateCategoryDto>) {
    const category = await this.findOne(id);

    return this.categoriesRepository.update(category.id, createCategoryDto);
  }
}
