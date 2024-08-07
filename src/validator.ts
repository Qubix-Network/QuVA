import { ValidationResult, ValidationRules } from "./types";

export function createValidator<T>(object: T, rules: ValidationRules<T>) {
  const errors: ValidationResult = {};

  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      const value = (object as any)[key];
      const fieldErrors: string[] = [];
      const validators = rules[key];

      for (const validator of validators) {
        const error = validator.validate(value);
        if (error) {
          fieldErrors.push(error);
        }
      }

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    }
  }

  return {
    check: Object.keys(errors).length === 0,
    errors,
  };
}
