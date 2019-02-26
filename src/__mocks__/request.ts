import createPromiseMock from '../../tests/utils/createPromiseMock';

export const {
  default: request,
  resolvePromise: resolveRequestPromise,
  rejectPromise: rejectRequestPromise,
  getPromise: getRequestPromise
} = createPromiseMock();

export default request;