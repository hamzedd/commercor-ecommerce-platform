import React from "react";
import {
  ProductTranslationType,
  ProductType,
} from "@/src/utils/types/product.type";
import { Link } from "@/src/i18n/navigation";
import { fetchCategories } from "@/src/service/apiServices/category.service";
import { productBreadcrumbsCategoriesHierarchy } from "@/src/utils/functions/product/productCategoriesHierarchy";
import { getTranslations } from "next-intl/server";

interface Props {
  productTranslation: ProductTranslationType;
  product: ProductType;
}

async function ProductPageBreadcrumbs({
  productTranslation,
  product,
}: Props) {
  const t = await getTranslations();
  const categories = await fetchCategories();

  const categoriesHierarchy = productBreadcrumbsCategoriesHierarchy({
    product,
    categories,
  });

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
      <Link
        href="/"
        className="text-gray-600 transition-colors hover:text-black"
      >
        {t("home")}
      </Link>

      <span className="text-xs text-gray-400" aria-hidden="true">
        ›
      </span>

      {categoriesHierarchy.map((category) => {
        const categoryTranslation =
          category.translations.find(
            (translation) =>
              translation.lang.toLowerCase() ===
              productTranslation.lang.toLowerCase(),
          ) || category.translations[0];

        return (
          <React.Fragment key={category.id}>
            <Link
              href={{
                pathname: "/categories/[slug]",
                params: {
                  slug: categoryTranslation?.slug,
                },
              }}
              className="text-gray-600 transition-colors hover:text-black"
            >
              {categoryTranslation?.name}
            </Link>

            <span className="text-xs text-gray-400" aria-hidden="true">
              ›
            </span>
          </React.Fragment>
        );
      })}

      <span className="font-semibold text-gray-900">
        {productTranslation.name}
      </span>
    </div>
  );
}

export default ProductPageBreadcrumbs;
