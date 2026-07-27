import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductFilterOptionValueDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterOptionValue.dto';
import { ProductFilterOptionValueEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionValue.entity';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

@Injectable()
export class ProductFilterOptionValuesService {
  constructor(
    @InjectRepository(ProductFilterOptionValueEntity)
    private readonly productFilterOptionValuesRepository: Repository<ProductFilterOptionValueEntity>,
    @InjectRepository(ProductFilterOptionEntity)
    private readonly productFilterOptionsRepository: Repository<ProductFilterOptionEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async assignProductFilterValue(data: ProductFilterOptionValueDto) {
    const filterOptionExists =
      await this.productFilterOptionsRepository.findOne({
        where: {
          id: data.productFilterOptionId,
        },
      });

    const productExists = await this.productsRepository.findOne({
      where: {
        id: data.productId,
      },
    });

    if (!productExists) {
      throw new BadRequestException(
        'Product already has this filter option assigned',
      );
    }

    if (filterOptionExists?.productFilterId !== data?.productFilterId) {
      throw new BadRequestException(
        'Filter option does not belong to the specified filter',
      );
    }

    const valueExists = await this.productFilterOptionValuesRepository.findOne({
      where: {
        productFilterId: data.productFilterId,
        productId: data.productId,
      },
    });
    if (valueExists) {
      await this.productFilterOptionValuesRepository.update(valueExists.id, {
        productFilterOptionId: data.productFilterOptionId,
        productId: data.productId,
        productFilterId: data.productFilterId,
      });
      return {
        ...valueExists,
        productFilterOptionId: data.productFilterOptionId,
        productId: data.productId,
        productFilterId: data.productFilterId,
      };
    } else {
      const newValue = this.productFilterOptionValuesRepository.create({
        productFilterOptionId: filterOptionExists.id,
        productId: productExists.id,
        productFilterId: filterOptionExists.productFilterId,
      });

      await this.productFilterOptionValuesRepository.save(newValue);
      return newValue;
    }
  }

  async deleteProductFilterValue(id: string) {
    const valueExists = await this.productFilterOptionValuesRepository.findOne({
      where: {
        id,
      },
    });

    if (!valueExists) {
      throw new BadRequestException('Product filter value does not exist');
    }

    await this.productFilterOptionValuesRepository.delete(id);
    return HttpStatus.OK;
  }
}
