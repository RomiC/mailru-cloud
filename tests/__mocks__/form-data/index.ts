export default class FormData {

  pipe = jest.fn();
  private length: number = 666;
  private boundary: string = 'mock-boundary';

  getLengthSync() {
    return this.length;
  }

  getBoundary() {
    return this.boundary;
  }
}
