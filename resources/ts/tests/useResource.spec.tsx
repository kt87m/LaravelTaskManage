declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す
import { renderHook } from '@testing-library/react-hooks';

import { useResource } from '../hooks/useResource';

jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('tasks', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('call api with passed id', () => {
    renderHook(() => useResource('tasks').get(24));
    expect(mockedAxios.get.mock.calls[0][0]).toMatch(/24$/);
  });
});
