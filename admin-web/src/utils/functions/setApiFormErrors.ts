import type { FormInstance } from "antd";

export default function setApiFormErrors(errors: any[], form: FormInstance) {
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      if (error?.field) {
        const fieldName = error?.field
          ?.split(".")
          ?.map((i: string) => (Number.isSafeInteger(+i) ? +i : i));
        const errorMessage = Array.isArray(error?.errors)
          ? error.errors
          : error?.errors?.[0];

        form.setFields([
          {
            name: fieldName,
            errors: errorMessage,
          },
        ]);
      }
    });
  } else {
    Object?.keys(errors)?.forEach((key) => {
      if (errors?.[key]) {
        const errorArr = key?.split(".");
        form.setFields([
          {
            name: errorArr?.length > 0 ? errorArr : key,
            errors: errors?.[key],
          },
        ]);
      }
    });
  }
}
