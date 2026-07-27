import TextInput from "../../../inputs/TextInput.tsx";
import TextAreaInput from "../../../inputs/TextAreaInput.tsx";

interface Props {
  className: string;
  languageCode: string;
  index: number;
}
function CategoryTranslationFields({ className, languageCode, index }: Props) {
  return (
    <div className={className}>
      <TextInput
        formProps={{
          name: ["translations", index, "lang"],
          className: "hidden",
          rules: [{ required: true, message: "Please enter category name!" }],
          initialValue: languageCode,
        }}
        inputProps={{
          value: languageCode,
        }}
      />
      <TextInput
        formProps={{
          label: "Category Name",
          name: ["translations", index, "name"],
          rules: [{ required: true, message: "Please enter category name!" }],
        }}
        inputProps={{
          placeholder: "Enter category name",
        }}
      />
      <TextAreaInput
        formProps={{
          label: "Description",
          name: ["translations", index, "description"],
          rules: [
            { required: true, message: "Please enter category description!" },
          ],
        }}
        inputProps={{
          rows: 4,
          placeholder: "Enter category description",
          showCount: true,
          maxLength: 500,
        }}
      />
      <TextInput
        formProps={{
          label: "slug",
          name: ["translations", index, "slug"],
          rules: [{ required: true, message: "Please enter category slug!" }],
        }}
        inputProps={{
          placeholder: "Enter category slug",
        }}
      ></TextInput>
      <TextInput
        formProps={{
          label: "Meta Title",
          name: ["translations", index, "metaTitle"],
          rules: [{ required: true, message: "Please enter meta title!" }],
        }}
        inputProps={{
          placeholder: "Enter meta title",
        }}
      ></TextInput>
      <TextAreaInput
        formProps={{
          label: "Meta Description",
          name: ["translations", index, "metaDescription"],
          rules: [
            { required: true, message: "Please enter meta description!" },
            {
              max: 160,
              message: "Meta description should not exceed 160 characters!",
            },
          ],
        }}
        inputProps={{
          rows: 3,
          placeholder: "Enter meta description",
          showCount: true,
          maxLength: 160,
        }}
      />
    </div>
  );
}

export default CategoryTranslationFields;
