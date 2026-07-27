import { ValidationError } from 'class-validator';

export default function flattenValidationErrors(errors: ValidationError[]) {
  const result: { field: string; errors: string[] }[] = [];

  const walk = (err: ValidationError, parentPath?: string) => {
    const fieldPath = parentPath
      ? `${parentPath}.${err.property}`
      : err.property;

    // Collect current node’s constraints
    if (err.constraints) {
      result.push({
        field: fieldPath,
        errors: Object.values(err.constraints).map((msg) =>
          // optional: trim leading property name in messages like "email must be an email"
          msg.replace(new RegExp(`^${err.property}\\s+`), ''),
        ),
      });
    }

    // Recurse into children for nested objects/arrays
    if (err.children && err.children.length) {
      err.children.forEach((child) => walk(child, fieldPath));
    }
  };

  errors.forEach((e) => walk(e));
  return result;
}
