export let resolveRequestToApiPromise: (reason: any) => void = null;
export let rejectRequestToApiPromise: (data: any) => void = null;
const _init = jest.fn(() => new Promise((res, rej) => {
  resolveRequestToApiPromise = res;
  rejectRequestToApiPromise = rej;
}));

export default jest.fn(_init);
