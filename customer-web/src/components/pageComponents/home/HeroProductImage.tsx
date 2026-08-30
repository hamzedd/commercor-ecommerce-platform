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
      <div className="flex aspect-square w-full items-center justify-center px-8 text-center text-slate-500">
        {fallback}
      </div>
    );
  }

  return (
    <div className="flex aspect-square w-full items-center justify-center overflow-hidden p-6 sm:p-10">
      <Image
        src={src}
        alt={alt}
        width={720}
        height={720}
        priority
        loading="eager"
        unoptimized
        onError={() => setHasError(true)}
        className="animate-ken-burns h-full w-full object-contain drop-shadow-md motion-reduce:animate-none"
      />
    </div>
  );
}

export default HeroProductImage;
