export default function HeroFeaturedMedia() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="auto"
        className="absolute inset-0 z-50 h-full w-full object-cover"
      >
        <source src="/videos/iphone-featured.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
