import { fetchCategories } from "@/src/service/apiServices/category.service";
import { fetchProducts } from "@/src/service/apiServices/product.service";
import CategoriesList from "@/src/components/pageComponents/home/categoriesList/CategoriesList";
import CategoryProductsList from "@/src/components/pageComponents/home/categoryProductsList/CategoryProductsList";
import { LocaleType } from "@/src/i18n/config";
import { Link } from "@/src/i18n/navigation";
import getImageSrcByBucketAndFileNames from "@/src/utils/functions/getImageSrcByBucketAndFileNames";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  const categories = await fetchCategories();

  const productsResponse = await fetchProducts({});
  const featuredProduct = productsResponse?.data?.[0];

  const featuredTranslation =
    featuredProduct?.translations?.find(
      (translation) =>
        translation.lang.toLowerCase() === locale.toLowerCase(),
    ) || featuredProduct?.translations?.[0];

  const featuredImage = featuredProduct?.images?.[0]?.name
    ? getImageSrcByBucketAndFileNames({
        bucketName: "products",
        fileName: featuredProduct.images[0].name,
      })
    : null;

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="overflow-hidden bg-gray-950 text-white">
        <div className="my-container grid min-h-[500px] items-center gap-12 py-16 lg:grid-cols-2">
          {/* Hero text */}
          <div className="flex max-w-2xl flex-col items-start gap-6">
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium">
              Shop smarter with Commercor
            </span>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Everything you need,
              <span className="block text-gray-300">
                all in one place.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
              Discover quality products, trusted brands and great prices with a
              simple and secure shopping experience.
            </p>

            <div className="flex flex-wrap gap-3">
              {featuredTranslation?.slug ? (
                <Link
                  href={{
                    pathname: "/products/[slug]",
                    params: {
                      slug: featuredTranslation.slug,
                    },
                  }}
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
                >
                  Shop Featured Product
                </Link>
              ) : (
                <a
                  href="#categories"
                  className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
                >
                  Shop Now
                </a>
              )}

              <a
                href="#categories"
                className="rounded-lg border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                Browse Categories
              </a>
            </div>
          </div>

          {/* Featured product */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-gray-800 to-gray-900 p-8 shadow-2xl">
              {featuredImage ? (
                <div className="flex min-h-[330px] items-center justify-center rounded-2xl bg-white p-8">
                  <img
                    src={featuredImage}
                    alt={featuredTranslation?.name || "Featured product"}
                    className="max-h-[280px] max-w-full object-contain transition duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex min-h-[330px] items-center justify-center rounded-2xl bg-gray-800">
                  <span className="text-gray-400">Featured Product</span>
                </div>
              )}

              {featuredProduct && (
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Featured
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-xl font-bold">
                      {featuredTranslation?.name}
                    </h2>

                    {featuredProduct.stock !== undefined && (
                      <p className="mt-2 text-sm text-gray-400">
                        {featuredProduct.stock > 0
                          ? `${featuredProduct.stock} available`
                          : "Out of stock"}
                      </p>
                    )}
                  </div>

                  {featuredProduct.price && (
                    <div className="shrink-0 rounded-xl bg-white px-4 py-3 text-black">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-xl font-bold">
                        ${Number(featuredProduct.price).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-gray-200 bg-white">
        <div className="my-container grid grid-cols-2 gap-6 py-7 md:grid-cols-4">
          <div>
            <p className="font-semibold">Fast Shopping</p>
            <p className="mt-1 text-sm text-gray-500">
              Simple checkout experience
            </p>
          </div>

          <div>
            <p className="font-semibold">Secure Orders</p>
            <p className="mt-1 text-sm text-gray-500">
              Safe account and order flow
            </p>
          </div>

          <div>
            <p className="font-semibold">Quality Products</p>
            <p className="mt-1 text-sm text-gray-500">
              Products from trusted brands
            </p>
          </div>

          <div>
            <p className="font-semibold">Customer Support</p>
            <p className="mt-1 text-sm text-gray-500">
              We're here when you need us
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-16 bg-gray-50 py-14">
        {/* Categories */}
        <section id="categories">
          <CategoriesList
            categories={categories}
            lang={locale as LocaleType}
          />
        </section>

        {/* Products */}
        {categories?.map((category) => (
          <CategoryProductsList
            key={category.id}
            category={category}
            lang={locale as LocaleType}
          />
        ))}
      </div>
    </main>
  );
}