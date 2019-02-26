export default function createPromiseMock() {
  let promise: Promise<any>;
  let resolve: (value?: any) => void;
  let reject: (reason?: any) => void;

  function initPromiseMock() {
    promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return {
      then(onFulfilled: (value?: any) => any) {
        promise = promise.then(onFulfilled);
        return this;
      },
      catch(onRejected: (reason?: any) => void) {
        promise = promise.catch(onRejected);
        return this;
      }
    };
  }

  return {
    getPromise() {
      return promise;
    },
    rejectPromise(error: any): void {
      reject(error);
    },
    resolvePromise(d: any): void {
      resolve(d);
    },
    default: jest.fn(initPromiseMock)
  };
}
