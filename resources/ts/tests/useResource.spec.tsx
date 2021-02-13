declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す
import { renderHook } from '@testing-library/react-hooks';

jest.mock('swr');
import _useSWR, { cache as _cache } from 'swr';
const {
  default: useSWR,
  cache,
}: { default: typeof _useSWR; cache: typeof _cache } = jest.requireActual(
  'swr'
);
const mockedUseSWR = _useSWR as jest.MockedFunction<typeof _useSWR>;
mockedUseSWR.mockImplementation((key, fn) => {
  return useSWR(key, fn);
});

jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);

import { useResource } from '../hooks/useResource';

describe('generate swr key and request url', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  test('if pathname does not include resource type, use the pathname with it appended', () => {
    history.pushState(null, '', '/xxx/yyy');
    renderHook(() => useResource('tasks').index());
    expect(mockedUseSWR.mock.calls[0][0]).toBe('/xxx/yyy/tasks');
    expect(mockedAxios.get.mock.calls[0][0]).toBe('/api/xxx/yyy/tasks');
  });

  test('if pathname includes resource type, use substring of the pathname up to resource type', () => {
    history.pushState(null, '', '/xxx/yyy/tasks/zzz');
    renderHook(() => useResource('tasks').index());
    expect(mockedUseSWR.mock.calls[0][0]).toBe('/xxx/yyy/tasks');
    expect(mockedAxios.get.mock.calls[0][0]).toBe('/api/xxx/yyy/tasks');
  });

  test('if pathname does not include resource type, use `/type/id` format', () => {
    history.pushState(null, '', '/xxx/yyy');
    renderHook(() => useResource('tasks').get(72));
    expect(mockedUseSWR.mock.calls[0][0]).toBe('/tasks/72');
    expect(mockedAxios.get.mock.calls[0][0]).toBe('/api/tasks/72');
  });

  test('if pathname includes `/type/id` fragment, use substring of the pathname up to `/type/id` fragment', () => {
    history.pushState(null, '', '/xxx/yyy/tasks/72/zzz');
    renderHook(() => useResource('tasks').get(72));
    expect(mockedUseSWR.mock.calls[0][0]).toBe('/xxx/yyy/tasks/72');
    expect(mockedAxios.get.mock.calls[0][0]).toBe('/api/xxx/yyy/tasks/72');
  });

  test('generated key does not include query string', () => {
    history.pushState(null, '', '/xxx/yyy/tasks?done=1');
    renderHook(() => useResource('tasks').index());
    expect(mockedUseSWR.mock.calls[0][0]).toBe('/xxx/yyy/tasks');
    expect(mockedAxios.get.mock.calls[0][0]).toBe('/api/xxx/yyy/tasks?done=1');
  });
});
