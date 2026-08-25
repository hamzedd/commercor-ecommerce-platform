"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ImageMagnifier from "@/src/components/ui/utis/imageMagnifier/ImageMagnifier";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import {
  ProductImageType,
  ProductTranslationType,
} from "@/src/utils/types/product.type";

interface Props {
  images: ProductImageType[];
  productTranslation?: ProductTranslationType;
}

function ProductImagesPreview({ images, productTranslation }: Props) {
  const t = useTranslations();
  const [selectedImageId, setSelectedImageId] = useState(images[0]?.id);
  const selectedImage =
    images.find((image) => image.id === selectedImageId) || images[0];
  const productName = productTranslation?.name || t("productImage");

  return (
    <section
      aria-label={t("productGallery")}
      className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 md:flex md:gap-5"
    >
      <div className="order-2 mt-3 flex gap-2 overflow-x-auto pb-1 md:order-1 md:mt-0 md:max-h-[560px] md:w-20 md:shrink-0 md:flex-col md:overflow-y-auto md:pb-0">
        {images.map((image, index) => {
          const isSelected = selectedImage?.id === image.id;
          return (
            <button
              key={image.id}
              type="button"
              aria-label={t("selectProductImage", { index: index + 1 })}
              aria-pressed={isSelected}
              onClick={() => setSelectedImageId(image.id)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:outline-none md:h-20 md:w-20 ${isSelected ? "border-violet-500 shadow-md shadow-violet-500/20" : "border-slate-200 hover:border-violet-300"}`}
            >
              <Image
                fill
                sizes="80px"
                alt={t("productImagePreview", { index: index + 1 })}
                src={getImageSrcByBucketAndFileNames({
                  bucketName: "products",
                  fileName: image.name,
                })}
                className="object-contain p-1.5"
              />
            </button>
          );
        })}
      </div>

      <div className="order-1 flex min-h-[320px] min-w-0 flex-1 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 via-white to-violet-50 p-3 sm:min-h-[420px] sm:p-6 md:order-2 lg:min-h-[560px]">
        {selectedImage ? (
          <ImageMagnifier
            src={getImageSrcByBucketAndFileNames({
              bucketName: "products",
              fileName: selectedImage.name,
            })}
            className="h-auto max-h-[520px] w-full max-w-[620px] rounded-lg object-contain"
            alt={productName}
            width={620}
            height={620}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-slate-500">
            <svg
              aria-hidden
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 19.5h16.5A1.5 1.5 0 0 0 21.75 18V6A1.5 1.5 0 0 0 20.25 4.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
              />
            </svg>
            <span className="text-sm font-medium">{t("noImage")}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductImagesPreview;
