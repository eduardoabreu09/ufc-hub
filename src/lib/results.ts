export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: string;
  private _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(`InvalidOperation: A result cannot be
          successful and contain an error`);
    }
    if (!isSuccess && !error) {
      throw new Error(`InvalidOperation: A failing result
          needs to contain an error message`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this._value) {
      throw new Error("Cant retrieve the value from a failed result.");
    }

    return this._value;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static failure<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<unknown>[]): Result<unknown> {
    const failureResult = results.find((r) => r.isFailure);
    if (failureResult) {
      return failureResult;
    }
    return Result.success<unknown>();
  }
}
