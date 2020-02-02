import { auth, dispatcher, file, token, user } from '../src/index';

jest.unmock('../src/dispatcher');

test('should export all available methods', () => {
  expect(auth).toBeInstanceOf(Function);

  expect(dispatcher).toBeInstanceOf(Function);

  expect(file.add).toBeInstanceOf(Function);
  expect(file.info).toBeInstanceOf(Function);
  expect(file.upload).toBeInstanceOf(Function);

  expect(token.csrf).toBeInstanceOf(Function);

  expect(user.space).toBeInstanceOf(Function);
});
