"use client";

import { useState, useSyncExternalStore } from "react";
import HeroProductImage from "./HeroProductImage";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Always false on the server and on the client's first render, so the
// <video> is what both the server-rendered HTML and the initial client
// paint show. useSyncExternalStore only swaps in the real value (if it
// differs) in a render that happens after hydration.
function getReducedMotionServerSnapshot() {
  return false;
}

interface Props {
  videoSrc: string;
  imageSrc: string | null;
  alt: string;
  fallback: string;
}

function HeroFeaturedMedia({ videoSrc, imageSrc, alt, fallback }: Props) {
  const [videoFailed, setVideoFailed] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  if (videoFailed || prefersReducedMotion) {
    if (!imageSrc) {
      return (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-white/5">
          <span className="text-slate-300">{fallback}</span>
        </div>
      );
    }
    return <HeroProductImage src={imageSrc} alt={alt} fallback={fallback} />;
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={imageSrc ?? undefined}
        aria-label={alt}
        onError={() => setVideoFailed(true)}
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

export default HeroFeaturedMedia;
