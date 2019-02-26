import createPromiseMock from '../../tests/utils/createPromiseMock';

export const {
  default: csrf,
  resolvePromise: resolveCsrfPromise,
  rejectPromise: rejectCsrfPromise,
  getPromise: getCsrfPromise
} = createPromiseMock();