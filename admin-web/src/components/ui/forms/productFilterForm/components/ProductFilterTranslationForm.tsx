import TextInput from "../../../inputs/TextInput.tsx";

interface Props {
  className?: string;
  languageCode: string;
  index: number;
}

function ProductFilterTranslationForm({
  className,
  languageCode,
  index,
}: Props) {
  return (
    <div className={className}>
      <TextInput
        formProps={{
          name: ["translations", index, "lang"],
          className: "hidden",
          rules: [{ required: true }],
          initialValue: languageCode,
        }}
        inputProps={{
          value: languageCode,
        }}
      />
      <TextInput
        formProps={{
          label: "Product Filter name",
          name: ["translations", index, "name"],
          rules: [{ required: true, message: "Please enter Product Filter name!" }],
        }}
        inputProps={{
          placeholder: "Product Filter Name",
        }}
      />
    </div>
  );
}

export default ProductFilterTranslationForm;
