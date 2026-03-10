import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfModule } from 'src/pdf/pdf.module';
import { Product } from 'src/products/entities/products.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/categories.entity';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category, Product]), PdfModule],
})
export class CategoriesModule {}
