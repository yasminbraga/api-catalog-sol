import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PdfService } from 'src/pdf/pdf.service';
import { Product } from 'src/products/entities/products.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/categories.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private readonly pdfService: PdfService,
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

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async findCategoryProducts(id: string) {
    try {
      const category = await this.findOne(id);
      const products = await this.productsRepository.find({
        where: { category: { id: category.id } },
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
  async generatePdf(id: string) {
    try {
      const category = await this.findOne(id);
      const products = await this.productsRepository.find({
        where: { category: { id: category.id } },
        select: {
          name: true,
          price: true,
          imageUrl: true,
        },
      });

      return this.pdfService.generateProductsPdf(products, category.name);
    } catch (error) {
      console.log(error);
    }
  }
}
