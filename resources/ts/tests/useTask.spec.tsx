declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す

import useTask from '../hooks/useTask';

const mockSWR = jest.fn((key: string) => key);

jest.mock('swr', () => ({
  __esModule: true,
  default: (key: string) => mockSWR(key),
}));

describe('useTask', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('call api with passed id', () => {
    useTask(24);
    expect(mockSWR.mock.calls[0][0]).toMatch(/24$/);
  });
});
