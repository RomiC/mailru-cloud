let _promise: Promise<any> = null;
let _resolve: (value?: {} | PromiseLike<{}>) => void = null;
let _reject: (reason?: any) => void = null;

const request = jest.fn(() => {
  _promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  return _promise;
});

export function resolveRequestPromise(value?: {} | PromiseLike<{}>): void {
  if (_resolve != null) {
    _resolve(value);
  }
}

export function rejectRequestPromise(reason?: any): void {
  if (_reject != null) {
    _reject(reason);
  }
}

export function getRequestPromise(): Promise<any> {
  return _promise;
}

export default request;