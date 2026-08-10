import { useEffect, useState } from "react";
import { getProductFiltersWithOptionsService } from "../../../service/apiServices/productFilterServices.ts";
import type { ProductFilterValueType } from "../../../utils/types/productFilterValueTypes.ts";
import EditProductPageFilter from "./EditProductPageFilter.tsx";
import type { FormOptionType } from "../../../utils/types/formTypes.ts";
import { getProductFilterValuesService } from "../../../service/apiServices/productServices.ts";
import countriesOptions from "../../ui/forms/brandForm/components/countriesOptions.ts";
import { getProductService } from "../../../service/apiServices/productServices.ts";
import { Alert } from "antd";

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
  const [incompatibleValuesCount, setIncompatibleValuesCount] = useState(0);

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

  const fetchFilterOptions = async (categoryId?: string) => {
    if (!categoryId) {
      setFilterOptions([]);
      return [];
    }
    const filtersResponse =
      await getProductFiltersWithOptionsService(categoryId);
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
    return filtersResponse;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [filterValuesResponse, product] = await Promise.all([
          getProductFilterValuesService(productId),
          getProductService(productId),
        ]);
        const filtersResponse = await fetchFilterOptions(product.categoryId);
        const allowedFilterIds = new Set(
          filtersResponse.map((filter) => filter.id),
        );
        setIncompatibleValuesCount(
          filterValuesResponse.filter(
            (value) => !allowedFilterIds.has(value.productFilterId),
          ).length,
        );
        const filterValuesMap: {
          [
            key: ProductFilterValueType["productFilterId"]
          ]: ProductFilterValueType;
        } = {};
        filterValuesResponse.forEach((value) => {
          filterValuesMap[value.productFilterId] = value;
        });
        setFilterValuesObject(filterValuesMap);
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
      {incompatibleValuesCount > 0 && (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message={`${incompatibleValuesCount} saved filter ${incompatibleValuesCount === 1 ? "value is" : "values are"} not assigned to this product's category`}
          description="The saved values were preserved and were not deleted. Assign their filters to this category or change the product category to make them available here again."
        />
      )}
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
