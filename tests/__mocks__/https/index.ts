import { Writable } from 'stream';

export class ClientRequest extends Writable {
  public on: (...args: any) => this = jest.fn((...args) => {
    return super.on.call(this, ...args);
  });

  public write: (...args: any) => boolean = jest.fn();

  public end: (...args: any) => void = jest.fn();
}

const clientRequestMock = new ClientRequest();

export default {
  request: jest.fn(() => clientRequestMock)
};
