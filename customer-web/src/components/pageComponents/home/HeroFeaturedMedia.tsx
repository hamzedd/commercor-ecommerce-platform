"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = true;
  }, []);

  const showVideo = !prefersReducedMotion && !videoFailed;

  if (!showVideo) {
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
        ref={videoRef}
        src={videoSrc}
        poster={imageSrc ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
        preload="auto"
        aria-label={alt}
        onError={() => setVideoFailed(true)}
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export default HeroFeaturedMedia;
