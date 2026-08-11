"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  alt: string;
  fallback: string;
  src: string;
}

function HeroProductImage({ alt, fallback, src }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex min-h-[330px] items-center justify-center px-8 text-center text-stone-500 sm:min-h-[390px]">
        {fallback}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={720}
      height={720}
      priority
      unoptimized
      onError={() => setHasError(true)}
      className="h-[330px] w-full object-contain p-8 sm:h-[390px]"
    />
  );
}

export default HeroProductImage;
