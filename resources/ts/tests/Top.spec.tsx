declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す

import React from 'react';
import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';

jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.create.mockReturnValue(mockedAxios);
mockedAxios.get.mockResolvedValue({ data: [] });

import { cache } from 'swr';

import Top from '../pages/Top';
import { Router } from 'react-router-dom';

describe('top page', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cache.clear();
  });

  it('should change search params on select filter', async () => {
    const history = createMemoryHistory();
    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Top />
      </Router>
    );
    await waitForElementToBeRemoved(() => getByText('loading...'));

    const select = getByTestId('filter');
    fireEvent.change(select, {
      target: {
        value: 'done=true',
      },
    });

    expect(history.location.search).toMatch(/done=true/);
  });

  it('should change search params on select sort type and sort direction', async () => {
    const history = createMemoryHistory();
    const { getByTestId, getByText } = render(
      <Router history={history}>
        <Top />
      </Router>
    );
    await waitForElementToBeRemoved(() => getByText('loading...'));

    const select = getByTestId('sort');
    fireEvent.change(select, {
      target: {
        value: 'updated_at',
      },
    });
    expect(history.location.search).toMatch(/sort=updated_at/);

    const desc = getByTestId('desc');
    fireEvent.click(desc);
    expect(history.location.search).toMatch(/sort=-updated_at/);

    fireEvent.change(select, {
      target: {
        value: 'created_at',
      },
    });
    expect(history.location.search).toMatch(/sort=-created_at/);
  });
});
