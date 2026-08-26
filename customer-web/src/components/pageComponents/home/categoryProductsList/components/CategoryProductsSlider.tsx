"use client";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import ProductCard from "@/src/components/ui/cards/productCard/ProductCard";
import { LocaleType } from "@/src/i18n/config";
import { ProductType } from "@/src/utils/types/product.type";

interface Props {
  products: ProductType[];
  lang: LocaleType;
}

function CategoryProductsSlider({ products, lang }: Props) {
  const t = useTranslations();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden pb-2">
        <div className="-ml-4 flex">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_82%] pl-4 sm:flex-[0_0_48%] md:flex-[0_0_32%] lg:flex-[0_0_24%] xl:flex-[0_0_20%]"
            >
              <ProductCard
                className="h-full w-full focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-4 focus-visible:outline-none"
                product={product}
                lang={lang}
              />
            </div>
          ))}
        </div>
      </div>
      {products.length > 1 && (
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            aria-label={t("previousProducts")}
            onClick={() => emblaApi?.scrollPrev()}
            className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:via-violet-600 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-violet-900/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <LeftOutlined aria-hidden />
          </button>
          <button
            type="button"
            aria-label={t("nextProducts")}
            onClick={() => emblaApi?.scrollNext()}
            className="btn-press flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-blue-600 hover:via-violet-600 hover:to-pink-600 hover:text-white hover:shadow-lg hover:shadow-violet-900/30 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <RightOutlined aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryProductsSlider;
