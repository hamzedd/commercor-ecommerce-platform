import { getTranslations } from "next-intl/server";
import { ProductTranslationType } from "@/src/utils/types/product.type";

interface Props {
  productTranslation: ProductTranslationType;
}

async function ProductDescription({ productTranslation }: Props) {
  const t = await getTranslations();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
      <p className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-xs font-bold tracking-[0.16em] text-transparent uppercase">
        {t("productInformation")}
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
        {t("productDescription")}
      </h2>
      <div className="mt-5 max-w-none text-sm leading-7 whitespace-pre-wrap text-slate-700 sm:text-base">
        {productTranslation?.description}
      </div>
    </section>
  );
}

export default ProductDescription;
