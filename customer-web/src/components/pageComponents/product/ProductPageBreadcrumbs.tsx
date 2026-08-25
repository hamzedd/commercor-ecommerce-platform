import React from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { fetchCategories } from "@/src/service/apiServices/category.service";
import { productBreadcrumbsCategoriesHierarchy } from "@/src/utils/functions/product/productCategoriesHierarchy";
import {
  ProductTranslationType,
  ProductType,
} from "@/src/utils/types/product.type";

interface Props {
  productTranslation: ProductTranslationType;
  product: ProductType;
}

async function ProductPageBreadcrumbs({ productTranslation, product }: Props) {
  const t = await getTranslations();
  const categories = await fetchCategories();
  const categoriesHierarchy = productBreadcrumbsCategoriesHierarchy({
    product,
    categories,
  });
  const linkClassName =
    "rounded-sm text-slate-300 transition-colors hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:outline-none";

  return (
    <nav
      aria-label={t("breadcrumbs")}
      className="flex min-w-0 items-center gap-2 overflow-hidden text-sm"
    >
      <Link href="/" className={linkClassName}>
        {t("home")}
      </Link>
      <span className="text-slate-600" aria-hidden>
        /
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
                params: { slug: categoryTranslation?.slug },
              }}
              className={`${linkClassName} shrink-0`}
            >
              {categoryTranslation?.name}
            </Link>
            <span className="text-slate-600" aria-hidden>
              /
            </span>
          </React.Fragment>
        );
      })}
      <span className="truncate font-semibold text-white">
        {productTranslation.name}
      </span>
    </nav>
  );
}

export default ProductPageBreadcrumbs;
