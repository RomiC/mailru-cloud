export default class FormData {
  private length: number = 666;
  private boundary: string = "mock-boundary";

  pipe = jest.fn(function (stream: WritableStream) { });

  getLengthSync() {
    return this.length;
  }

  getBoundary() {
    return this.boundary;
  }
}
