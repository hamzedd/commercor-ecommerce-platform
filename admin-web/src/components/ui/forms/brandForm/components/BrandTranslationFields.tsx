import TextInput from "../../../inputs/TextInput.tsx";
import TextAreaInput from "../../../inputs/TextAreaInput.tsx";

interface Props {
  className: string;
  languageCode: string;
  index: number;
}
function BrandTranslationFields({ className, languageCode, index }: Props) {
  return (
    <div className={className}>
      <TextInput
        formProps={{
          name: ["translations", index, "lang"],
          className: "hidden",
          rules: [{ required: true, message: "Please enter Brand name!" }],
          initialValue: languageCode,
        }}
        inputProps={{
          value: languageCode,
        }}
      />
      <TextInput
        formProps={{
          label: "Brand Name",
          name: ["translations", index, "name"],
          rules: [{ required: true, message: "Please enter Brand name!" }],
        }}
        inputProps={{
          placeholder: "Enter Brand name",
        }}
      />
      <TextAreaInput
        formProps={{
          label: "Description",
          name: ["translations", index, "description"],
          rules: [
            { required: true, message: "Please enter Brand description!" },
          ],
        }}
        inputProps={{
          rows: 4,
          placeholder: "Enter Brand description",
          showCount: true,
          maxLength: 500,
        }}
      />
      <TextInput
        formProps={{
          label: "Slug",
          name: ["translations", index, "slug"],
          rules: [{ required: true, message: "Please enter Brand slug!" }],
        }}
        inputProps={{
          placeholder: "Enter Brand slug",
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

export default BrandTranslationFields;
