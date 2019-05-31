import { PathLike, Stats } from 'fs';
import { Stream } from 'stream';

let stat: Stats = null;

export function setStat(s: Stats): void {
  stat = s;
}

export const statSync = jest.fn((): Stats => {
  return stat;
});

let readStream: Stream = null;

export function setReadStream(stream: Stream): void {
  readStream = stream;
}

export const createReadStream = jest.fn((): Stream => {
  return readStream;
});
