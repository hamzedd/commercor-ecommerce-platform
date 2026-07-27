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
    <div className="overflow-hidden">
      <div className="-mx-2 px-2" ref={emblaRef}>
        <div className="flex gap-3 md:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_75%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%]"
            >
              <ProductCard
                className={"h-full w-full"}
                product={product}
                lang={lang}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryProductsSlider;
