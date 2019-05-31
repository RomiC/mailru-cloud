export let resolveDispatcherPromise: (reason: any) => void = null;
export let rejectDispatcherPromise: (data: any) => void = null;
export const dispatcher = jest.fn(() => new Promise((res, rej) => {
  resolveDispatcherPromise = res;
  rejectDispatcherPromise = rej;
}));