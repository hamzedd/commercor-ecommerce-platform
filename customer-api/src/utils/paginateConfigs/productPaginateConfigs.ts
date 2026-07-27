import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import { ProductEntity } from '@/src/libs/models/entities/product/Product.entity';

export const getProductsPaginateConfig: PaginateConfig<ProductEntity> = {
  sortableColumns: ['id', 'price'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['translations.name'],
  relations: {
    translations: true,
    images: true,
  },
  filterableColumns: {
    brandId: [FilterOperator.EQ],
    categoryId: [FilterOperator.EQ],
    price: [FilterOperator.GTE, FilterOperator.LTE],
  },
};
