import { fetchCategories } from "@/src/service/apiServices/category.service";
import CategoriesList from "@/src/components/pageComponents/home/categoriesList/CategoriesList";
import CategoryProductsList from "@/src/components/pageComponents/home/categoryProductsList/CategoryProductsList";

interface Props {
  params: Promise<{
    locale: string;
  }>;
}
export default async function Home({ params }: Props) {
  const { locale } = await params;
  const categories = await fetchCategories();

  return (
    <div className={"my-10 flex flex-col items-center gap-5"}>
      <CategoriesList categories={categories} lang={locale} />
      {categories?.map((category) => (
        <CategoryProductsList
          lang={locale}
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}
