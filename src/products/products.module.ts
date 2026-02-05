import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/categories.entity';
import { UserService } from 'src/users/user.service';
import { Product } from './entities/products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [UserService],
})
export class ProductsModule {}
