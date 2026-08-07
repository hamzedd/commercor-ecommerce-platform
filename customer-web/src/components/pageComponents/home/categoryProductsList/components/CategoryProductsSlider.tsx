"use client";

import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { ProductType } from "@/src/utils/types/product.type";
import useEmblaCarousel from "embla-carousel-react";
import { LocaleType } from "@/src/i18n/config";

interface Props {
  products: ProductType[];
  lang: LocaleType;
}

function CategoryProductsSlider({ products, lang }: Props) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="-ml-4 flex">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-0 flex-[0_0_82%] pl-4 sm:flex-[0_0_48%] md:flex-[0_0_32%] lg:flex-[0_0_24%] xl:flex-[0_0_20%]"
          >
            <ProductCard
              className="h-full w-full"
              product={product}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryProductsSlider;