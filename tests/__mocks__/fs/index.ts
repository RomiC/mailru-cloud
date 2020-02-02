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

const createReadStream = jest.fn((): StreamMock => readStream);

let writeStream: StreamMock = null;

export function setWriteStream(stream: StreamMock): void {
  writeStream = stream;
}

const createWriteStream = jest.fn((): StreamMock => writeStream);

export default {
  statSync,
  createReadStream,
  createWriteStream
};
