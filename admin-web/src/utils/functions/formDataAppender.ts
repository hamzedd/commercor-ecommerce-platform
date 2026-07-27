interface props {
  values: any;
  formData: FormData;
  prefix?: string;
}

export default function formDataAppender({
  formData,
  prefix = "",
  values,
}: props) {
  Object.keys(values).forEach((key) => {
    if (values[key]?.file || values[key]?.fileList) {
      if (values[key]?.fileList?.length > 1) {
        values[key]?.fileList?.forEach((file: any) => {
          if (!file?.id) {
            formData.append(`${prefix}${key}`, file?.originFileObj);
          }
        });
      } else if (!values[key]?.id) {
        formData.append(
          `${prefix}${key}`,
          values[key]?.file || values[key]?.fileList?.[0]?.originFileObj,
        );
      }
    } else if (values[key]?.$isDayjsObject) {
      formData.append(`${prefix}${key}`, values[key].toISOString());
    } else if (Array.isArray(values[key])) {
      formData.append(`${prefix}${key}`, JSON.stringify(values[key]));
    } else if (
      typeof values[key] === "object" &&
      !Array.isArray(values[key]) &&
      values[key] !== null
    ) {
      formDataAppender({
        values: values[key],
        formData,
        prefix: `${prefix}${key}`,
      });
    } else if (values[key] || Number.isInteger(values[key])) {
      formData.append(`${prefix}${key}`, values[key]);
    }
  });
}
