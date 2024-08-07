export abstract class QuVA {
  constructor(protected errorMessage: string = "", protected ignoreEmptyValues: boolean = false) {}

  abstract validate(value: any): string | null;

  protected shouldValidate(value: any): boolean {
    return !this.ignoreEmptyValues || (this.ignoreEmptyValues && value !== undefined && value !== null && value !== "");
  }
}

export class IsRequired extends QuVA {
  constructor(errorMessage?: string) {
    super(errorMessage, false);
  }
  validate(value: any): string | null {
    return !!value && value.trim().length > 0 ? null : this.errorMessage || "This field is required";
  }
}

// Minimum length QuVA with custom error message
export class MinLength extends QuVA {
  constructor(length: number, errorMessage?: string) {
    super(errorMessage, true);
    this.length = length;
  }

  private length: number;

  validate(value: any): string | null {
    if (this.shouldValidate(value)) {
      return value && value.length >= this.length
        ? null
        : this.errorMessage || `This field must be at least ${this.length} characters long`;
    }
    return null;
  }
}

// Maximum length QuVA with custom error message
export class MaxLength extends QuVA {
  constructor(length: number, errorMessage?: string) {
    super(errorMessage, true);
    this.length = length;
  }

  private length: number;

  validate(value: any): string | null {
    if (this.shouldValidate(value)) {
      return value && value.length <= this.length ? null : this.errorMessage || `This field can be at most ${this.length} characters long`;
    }
    return null;
  }
}

export class EmailOnly extends QuVA {
  validate(value: any): string | null {
    if (this.shouldValidate(value)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : this.errorMessage || "This field must be a valid email format";
    }
    return null;
  }
}

export class RangeNumeric extends QuVA {
  constructor(min: number, max: number, errorMessage?: string) {
    super(errorMessage, true);

    this.min = min;
    this.max = max;
  }

  private min: number;
  private max: number;

  validate(value: any): string | null {
    if (this.shouldValidate(value)) {
      const numeric = parseFloat(value);

      if (isNaN(numeric)) {
        return this.errorMessage || "This field must be numeric";
      } else if (numeric < this.min || numeric > this.max) {
        return this.errorMessage || `This field must be between ${this.min} and ${this.max}`;
      }

      return null;
    }
    return null;
  }
}

export class Include extends QuVA {
  constructor(array: string[], errorMessage?: string) {
    super(errorMessage, true);
    this.array = array;
  }

  private array: string[];

  validate(value: any): string | null {
    if (!this.array.includes(value)) {
      return this.errorMessage || `This field must be one of ${this.array.toString()}`;
    }
    return null;
  }
}
