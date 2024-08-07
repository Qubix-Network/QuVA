import { QuVA } from "./class";

export type ValidationRules<T> = {
  [P in keyof T]: QuVA[];
};

export interface ValidationResult {
  [key: string]: string[];
}
