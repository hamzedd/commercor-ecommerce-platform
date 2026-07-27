import { ProductFilterOptionDto } from '@/src/libs/models/dtos/productsFilter/ProductFilterOption.dto';
import { ProductFilterOptionEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOption.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { ProductFilterOptionTranslationEntity } from '@/src/libs/models/entities/productFilter/ProductFilterOptionTranslation.entity';

@Injectable()
export class ProductFilterOptionsService {
  constructor(
    @InjectRepository(ProductFilterOptionEntity)
    private readonly productFilterOptionRepository: Repository<ProductFilterOptionEntity>,
    @InjectRepository(ProductFilterOptionTranslationEntity)
    private readonly productFilterOptionTranslationRepository: Repository<ProductFilterOptionTranslationEntity>,
  ) {}

  async createProductFilterOption(data: ProductFilterOptionDto) {
    const nameExists =
      await this.productFilterOptionTranslationRepository.findOne({
        where: { name: In(data.translations.map((t) => t.name)) },
      });
    if (nameExists) {
      throw new BadRequestException(
        'Product filter option name must be unique',
      );
    }
    const newOption = this.productFilterOptionRepository.create(data);
    return this.productFilterOptionRepository.save(newOption);
  }

  async getProductFilterOptionsByFilterId(filterId: string) {
    return this.productFilterOptionRepository.find({
      where: { productFilterId: filterId },
      relations: ['translations'],
    });
  }

  async deleteProductFilterOption(id: string) {
    return this.productFilterOptionRepository.delete({
      id,
    });
  }

  async updateProductFilterOption(id: string, data: ProductFilterOptionDto) {
    const nameExists =
      await this.productFilterOptionTranslationRepository.findOne({
        where: {
          productFilterOptionId: Not(id),
          name: In(data.translations.map((t) => t.name)),
        },
      });
    if (nameExists) {
      throw new BadRequestException(
        'Product filter option name must be unique',
      );
    }
    await this.productFilterOptionRepository.manager.transaction(
      async (manager) => {
        const filterOptionRepo = manager.getRepository(
          ProductFilterOptionEntity,
        );
        const translationRepo = manager.getRepository(
          ProductFilterOptionTranslationEntity,
        );

        const filterOption = await filterOptionRepo.findOneOrFail({
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });

        Object.keys(data).forEach((key) => {
          if (key !== 'translations') {
            filterOption[key] = data[key];
          }
        });

        await translationRepo.delete({ productFilterOptionId: id });

        filterOption.translations = Array.isArray(data.translations)
          ? data.translations.map((t) =>
              translationRepo.create({
                ...t,
                productFilterOptionId: id,
                productFilterOption: filterOption,
              }),
            )
          : [];

        await filterOptionRepo.save(filterOption);
      },
    );

    return { message: 'Product Filter Option updated successfully' };
  }
}
