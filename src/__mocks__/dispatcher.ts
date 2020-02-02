export let resolveDispatcherPromise: (reason: any) => void = null;
export let rejectDispatcherPromise: (data: any) => void = null;
const dispatcher = jest.fn(() => new Promise((res, rej) => {
  resolveDispatcherPromise = res;
  rejectDispatcherPromise = rej;
}));

export default dispatcher;