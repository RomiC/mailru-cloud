export let resolveCsrfPromise: (reason: any) => void = null;
export let rejectCsrfPromise: (data: any) => void = null;
export const csrf = jest.fn(() => new Promise((res, rej) => {
  resolveCsrfPromise = res;
  rejectCsrfPromise = rej;
}));