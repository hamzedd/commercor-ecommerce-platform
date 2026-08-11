import { ProductType } from "@/src/utils/types/product.type";
import { CategoryType } from "@/src/utils/types/category.type";

export function productBreadcrumbsCategoriesHierarchy({
  product,
  categories,
}: {
  product: ProductType;
  categories: CategoryType[];
}): CategoryType[] {
  const hierarchy: CategoryType[] = [];
  let currentCategory = categories.find((cat) => cat.id === product.categoryId);

  while (currentCategory) {
    hierarchy.unshift(currentCategory);
    if (currentCategory.parentId) {
      currentCategory = categories.find(
        (cat) => cat.id === currentCategory?.parentId,
      );
    } else {
      currentCategory = undefined;
    }
  }

  return hierarchy;
}
