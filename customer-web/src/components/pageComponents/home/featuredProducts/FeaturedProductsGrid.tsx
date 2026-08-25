"use client";

import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { LocaleType } from "@/src/i18n/config";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  products: ProductType[];
  lang: LocaleType;
}

function FeaturedProductsGrid({ products, lang }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          className="focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:outline-none"
          style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
          product={product}
          lang={lang}
        />
      ))}
    </div>
  );
}

export default FeaturedProductsGrid;
