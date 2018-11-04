interface IQueryParams {
  [key: string]: any;
}

interface IHeaders {
  [key: string]: any;
}

interface IRequestData {
  [key: string]: any;
}

interface IRequestOptions {
  /**
   * URL to request
   */
  url: string;
  /**
   * Request method name
   * @default 'GET'
   */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /**
   * Query params
   */
  query?: IQueryParams;
  /**
   * Form data
   */
  form?: any;
  /**
   * Request data
   */
  data?: IRequestData;
  /**
   * List of headers
   */
  headers?: IHeaders;
  /**
   * Parse response body as JSON
   * @default true
   */
  json?: boolean;
  /**
   * Return full response instead of data only
   * @default false
   */
  fullResponse?: boolean;
}