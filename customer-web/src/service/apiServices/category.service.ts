import api from "@/src/service/apis/api";
import { CategoryType } from "@/src/utils/types/category.type";
import fetchApi from "@/src/service/apis/fetchApi";

export async function getCategories(): Promise<CategoryType[]> {
  return api.get("/categories").then((res) => res.data);
}

export async function fetchCategories(): Promise<CategoryType[]> {
  return fetchApi("/categories", {
    next: {
      revalidate: 60 * 5, // Revalidate every 5 minutes
      tags: ["categories"],
    },
  });
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryType> {
  return fetchApi(`/categories/${slug}`, {
    next: {
      revalidate: 60 * 5, // Revalidate every 5 minutes
      tags: ["categories", slug],
    },
  });
}
