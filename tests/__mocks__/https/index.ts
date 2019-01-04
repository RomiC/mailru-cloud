const fakeRequest = {
  on: jest.fn(),
  write: jest.fn(),
  end: jest.fn()
};

export default {
  request: jest.fn(() => {
    return fakeRequest;
  })
};
