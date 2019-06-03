import { Stats } from 'fs';
import { Stream } from 'stream';

export type StatsMock = Partial<Stats>;
export type StreamMock = Partial<Stream>;

let stat: StatsMock = null;

export function setStat(s: StatsMock): void {
  stat = s;
}

const statSync = jest.fn((): StatsMock => {
  return stat;
});

let readStream: StreamMock = null;

export function setReadStream(stream: StreamMock): void {
  readStream = stream;
}

const createReadStream = jest.fn((): StreamMock => {
  return readStream;
});

export default {
  statSync,
  createReadStream
};
