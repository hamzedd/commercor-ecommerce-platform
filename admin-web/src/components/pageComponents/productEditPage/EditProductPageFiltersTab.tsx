import { useEffect, useState } from "react";
import { getProductFiltersWithOptionsService } from "../../../service/apiServices/productFilterServices.ts";
import type { ProductFilterValueType } from "../../../utils/types/productFilterValueTypes.ts";
import EditProductPageFilter from "./EditProductPageFilter.tsx";
import type { FormOptionType } from "../../../utils/types/formTypes.ts";
import {
  getProductFilterValuesService,
  getProductService,
} from "../../../service/apiServices/productServices.ts";
import countriesOptions from "../../ui/forms/brandForm/components/countriesOptions.ts";

interface Props {
  productId: string;
}

function EditProductPageFiltersTab({ productId }: Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [filterValuesObject, setFilterValuesObject] = useState<{
    [key: ProductFilterValueType["productFilterId"]]: ProductFilterValueType;
  }>({});
  const [filterOptions, setFilterOptions] = useState<
    { id: string; title: string; options: FormOptionType[] }[]
  >([]);

  const fetchFilterValues = async () => {
    const filterValuesResponse = await getProductFilterValuesService(productId);
    const filterValuesMap: {
      [
        key: ProductFilterValueType["productFilterOptionId"]
      ]: ProductFilterValueType;
    } = {};
    filterValuesResponse.forEach((value) => {
      filterValuesMap[value.productFilterId] = value;
    });
    setFilterValuesObject(filterValuesMap);
  };

  const fetchFilterOptions = async () => {
    const product = await getProductService(productId);
    const filtersResponse = await getProductFiltersWithOptionsService(
      String(product.categoryId),
    );
    setFilterOptions(
      filtersResponse.map((filter) => ({
        title:
          filter?.translations?.find(
            (t) => t?.lang === "EN" || t?.lang === countriesOptions[0].value,
          )?.name || filter?.translations?.[0]?.name,
        id: filter.id,
        options: filter.options.map((option) => ({
          label:
            option?.translations?.find(
              (t) => t?.lang === "EN" || t?.lang === countriesOptions[0].value,
            )?.name || option?.translations?.[0]?.name,
          value: option.id,
        })),
      })),
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchFilterValues();
        await fetchFilterOptions();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {filterOptions.map((filterOption) => {
        const filterValue = filterValuesObject?.[filterOption?.id];

        return (
          <EditProductPageFilter
            productId={productId}
            filterValue={filterValue}
            key={filterOption.id}
            filterOptions={filterOption}
            fetchValues={fetchFilterValues}
          />
        );
      })}
    </div>
  );
}

export default EditProductPageFiltersTab;
