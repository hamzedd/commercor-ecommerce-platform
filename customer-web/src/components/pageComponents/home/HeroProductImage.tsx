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
      <div className="flex min-h-[330px] items-center justify-center px-8 text-center text-slate-500 sm:min-h-[390px]">
        {fallback}
      </div>
    );
  }

  return (
    <div className="flex h-[330px] items-center justify-center p-6 sm:h-[390px] sm:p-10">
      <Image
        src={src}
        alt={alt}
        width={720}
        height={720}
        priority
        loading="eager"
        unoptimized
        onError={() => setHasError(true)}
        className="h-full w-full object-contain drop-shadow-md"
      />
    </div>
  );
}

export default HeroProductImage;
