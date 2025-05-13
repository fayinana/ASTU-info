export default class ApiQuerySender {
  private queryParams: URLSearchParams;

  constructor() {
    // Initialize queryParams with the current URL's query string
    this.queryParams = new URLSearchParams(window.location.search);
  }

  /**
   * Set a query parameter in the URL.
   * @param key - The query parameter key.
   * @param value - The query parameter value.
   */
  setParam(key: string, value: string): void {
    this.queryParams.set(key, value);
    this.updateUrl();
  }

  /**
   * Remove a query parameter from the URL.
   * @param key - The query parameter key to remove.
   */
  removeParam(key: string): void {
    this.queryParams.delete(key);
    this.updateUrl();
  }

  /**
   * Clear all query parameters from the URL.
   */
  clearParams(): void {
    this.queryParams = new URLSearchParams();
    this.updateUrl();
  }

  /**
   * Update the browser's URL to reflect the current query parameters.
   * This does not cause a page reload.
   */
  private updateUrl(): void {
    const newUrl = `${window.location.pathname}?${this.queryParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }

  /**
   * Get the current query parameters as an object.
   * @returns An object representing the current query parameters.
   */
  getQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    this.queryParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  /**
   * Get the current query string.
   * @returns The query string formatted for use in a URL.
   */
  getQueryString(): string {
    return this.queryParams.toString();
  }
}
