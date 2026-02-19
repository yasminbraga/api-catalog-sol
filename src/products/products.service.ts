import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UploadService } from 'src/uploads/upload.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly uploadService: UploadService,
  ) {}

  async findOne() {}
  async findAllByCategory(categoryId: string) {
    try {
      const foundCategory = await this.categoriesService.findOne(categoryId);

      const productsByCategory = await this.productsRepository.findBy({
        category: { id: foundCategory.id },
      });
      return productsByCategory;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao encontrar produtos');
    }
  }
  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    try {
      const { name, price, categoryId } = createProductDto;
      const category = await this.categoriesService.findOne(categoryId);

      const { publicUrl, key } = await this.uploadService.uploadFile(file);

      const productData = this.productsRepository.create({
        name,
        price,
        category,
        imageUrl: publicUrl,
        imageKey: key,
      });

      return await this.productsRepository.save(productData);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar produto');
    }
  }
  async update() {}
  async remove() {}
}
