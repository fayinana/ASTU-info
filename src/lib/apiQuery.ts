// Define a type for query parameter values
type QueryParamValue = string | number | boolean | null | undefined;

// Define a type for the query parameters object
type QueryParams = Record<string, QueryParamValue>;

/**
 * A class to manage URL query parameters with type safety and enhanced functionality.
 */
export default class ApiQuerySender {
  private queryParams: URLSearchParams;

  constructor(initialParams?: QueryParams | URLSearchParams | string) {
    // Initialize queryParams based on input
    if (initialParams instanceof URLSearchParams) {
      this.queryParams = initialParams;
    } else if (typeof initialParams === "string") {
      this.queryParams = new URLSearchParams(initialParams);
    } else if (initialParams) {
      this.queryParams = new URLSearchParams();
      this.setParams(initialParams);
    } else {
      // Default to current URL's query string
      this.queryParams = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : ""
      );
    }
  }

  /**
   * Set a single query parameter in the URL.
   * @param key - The query parameter key.
   * @param value - The query parameter value (string, number, boolean, null, or undefined).
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  setParam(key: string, value: QueryParamValue, update: boolean = true): void {
    if (value === null || value === undefined) {
      this.queryParams.delete(key);
    } else {
      this.queryParams.set(key, String(value));
    }
    if (update) {
      this.updateUrl();
    }
  }

  /**
   * Set multiple query parameters at once.
   * @param params - An object containing key-value pairs for query parameters.
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  setParams(params: QueryParams, update: boolean = true): void {
    Object.entries(params).forEach(([key, value]) => {
      this.setParam(key, value, false);
    });
    if (update) {
      this.updateUrl();
    }
  }

  /**
   * Append a value to a query parameter (useful for multi-value params).
   * @param key - The query parameter key.
   * @param value - The value to append.
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  appendParam(
    key: string,
    value: QueryParamValue,
    update: boolean = true
  ): void {
    if (value !== null && value !== undefined) {
      this.queryParams.append(key, String(value));
      if (update) {
        this.updateUrl();
      }
    }
  }

  /**
   * Remove a query parameter from the URL.
   * @param key - The query parameter key to remove.
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  removeParam(key: string, update: boolean = true): void {
    this.queryParams.delete(key);
    if (update) {
      this.updateUrl();
    }
  }

  /**
   * Clear all query parameters.
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  clearParams(update: boolean = true): void {
    this.queryParams = new URLSearchParams();
    if (update) {
      this.updateUrl();
    }
  }

  /**
   * Get a single query parameter value.
   * @param key - The query parameter key.
   * @returns The value as a string, or null if not found.
   */
  getParam(key: string): string | null {
    return this.queryParams.get(key);
  }

  /**
   * Get all values for a multi-value query parameter.
   * @param key - The query parameter key.
   * @returns An array of values, or empty array if not found.
   */
  getAllParams(key: string): string[] {
    return this.queryParams.getAll(key);
  }

  /**
   * Get the current query parameters as an object.
   * @returns An object representing the current query parameters.
   */
  getQueryParams(): QueryParams {
    const params: QueryParams = {};
    this.queryParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  /**
   * Get the current query string.
   * @returns The query string formatted for use in a URL (without leading '?').
   */
  getQueryString(): string {
    return this.queryParams.toString();
  }

  /**
   * Check if a query parameter exists.
   * @param key - The query parameter key.
   * @returns True if the parameter exists, false otherwise.
   */
  hasParam(key: string): boolean {
    return this.queryParams.has(key);
  }

  /**
   * Update the browser's URL to reflect the current query parameters.
   * This does not cause a page reload.
   * @param basePath - Optional base path to use instead of current pathname.
   */
  private updateUrl(basePath?: string): void {
    if (typeof window === "undefined") return; // Skip in non-browser environments
    const path = basePath || window.location.pathname;
    const newUrl = `${path}?${this.queryParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  /**
   * Get a new instance with the current query parameters for immutability.
   * @returns A new ApiQuerySender instance.
   */
  clone(): ApiQuerySender {
    return new ApiQuerySender(new URLSearchParams(this.queryParams.toString()));
  }

  /**
   * Merge query parameters from another source.
   * @param params - Query parameters to merge (object, URLSearchParams, or string).
   * @param update - Whether to update the browser URL immediately (default: true).
   */
  mergeParams(
    params: QueryParams | URLSearchParams | string,
    update: boolean = true
  ): void {
    let mergeParams: URLSearchParams;
    if (params instanceof URLSearchParams) {
      mergeParams = params;
    } else if (typeof params === "string") {
      mergeParams = new URLSearchParams(params);
    } else {
      mergeParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          mergeParams.set(key, String(value));
        }
      });
    }

    mergeParams.forEach((value, key) => {
      this.queryParams.set(key, value);
    });

    if (update) {
      this.updateUrl();
    }
  }

  /**
   * Subscribe to URL changes (e.g., popstate events).
   * @param callback - Function to call when the URL changes.
   * @returns A function to unsubscribe.
   */
  subscribe(callback: (params: QueryParams) => void): () => void {
    const handler = () => {
      this.queryParams = new URLSearchParams(window.location.search);
      callback(this.getQueryParams());
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }
}
