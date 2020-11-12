declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す

import { useResource } from '../hooks/useResource';

const mockSWR = jest.fn((key: string) => key);

jest.mock('swr', () => ({
  __esModule: true,
  default: (key: string) => mockSWR(key),
}));

describe('tasks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('call api with passed id', () => {
    const tasksAccess = useResource('tasks');
    tasksAccess.get(24);
    expect(mockSWR.mock.calls[0][0]).toMatch(/24$/);
  });
});
