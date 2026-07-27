"use client";
import {
  ProductImageType,
  ProductTranslationType,
} from "@/src/utils/types/product.type";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";
import ImageMagnifier from "@/src/components/ui/utis/imageMagnifier/ImageMagnifier";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: ProductImageType[];
  productTranslation?: ProductTranslationType;
}

function ProductImagesPreview({ images, productTranslation }: Props) {
  const [selectedImage, setSelectedImage] = useState<ProductImageType>(
    images[0],
  );

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:gap-5 md:p-6 lg:w-auto">
      {/* Thumbnail strip - horizontal on mobile, vertical on desktop */}
      <div className="flex gap-2 overflow-x-auto md:h-[400px] md:w-auto md:flex-col md:overflow-x-visible md:overflow-y-auto lg:h-[500px]">
        {images?.map((image, index) => (
          <Image
            key={image.id}
            width={80}
            height={80}
            alt={`image ${index + 1} preview`}
            src={getImageSrcByBucketAndFileNames({
              bucketName: "products",
              fileName: image.name,
            })}
            onClick={() => setSelectedImage(image)}
            className={`h-16 w-16 flex-shrink-0 cursor-pointer rounded-lg border-2 object-contain p-1 transition-all md:h-20 md:w-20 ${
              selectedImage.id === image.id
                ? "border-black shadow-md"
                : "border-gray-200 hover:border-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Main image display */}
      <div className="flex items-center justify-center rounded-xl bg-gray-50 p-4">
        <ImageMagnifier
          src={getImageSrcByBucketAndFileNames({
            bucketName: "products",
            fileName: selectedImage.name,
          })}
          className={
            "h-[300px] w-full rounded-lg object-contain md:h-[400px] md:w-auto lg:h-[500px]"
          }
          alt={productTranslation?.name || "Product Image"}
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}

export default ProductImagesPreview;
