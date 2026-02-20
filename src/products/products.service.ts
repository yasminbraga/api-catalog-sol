import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }
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
  async update(
    id: string,
    updateProductDto: Partial<Product>,
    file?: Express.Multer.File,
  ) {
    const product = await this.findOne(id);

    if (file) {
      await this.uploadService.removeFile(product.imageKey);
      const { publicUrl, key } = await this.uploadService.uploadFile(file);
      updateProductDto = {
        ...updateProductDto,
        imageKey: key,
        imageUrl: publicUrl,
      };
    }

    return this.productsRepository.update(product.id, updateProductDto);
  }
  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.uploadService.removeFile(product.imageKey);

    await this.productsRepository.remove(product);
  }
}
