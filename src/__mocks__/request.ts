export let resolveRequestPromise: (reason: any) => void = null;
export let rejectRequestPromise: (data: any) => void = null;
const _init = jest.fn(() => new Promise((res, rej) => {
  resolveRequestPromise = res;
  rejectRequestPromise = rej;
}));

export default jest.fn(_init);