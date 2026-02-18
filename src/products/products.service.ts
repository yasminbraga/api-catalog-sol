import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { UploadService } from 'src/uploads/upload.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly uploadService: UploadService,
  ) {}

  async findOne() {}
  async findByCategory() {}
  async create(createProductDto: CreateProductDto, file: Express.Multer.File) {
    try {
      const { name, price, categoryId } = createProductDto;
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) throw new NotFoundException('Categoria não encontrada');

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
