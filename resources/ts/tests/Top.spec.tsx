declare const expect: jest.Expect; // cypressとの競合回避  TODO: マシな回避策探す

import React from 'react';
import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';

import axios from 'axios';
axios.get = jest.fn().mockResolvedValue({ data: [] });

import Top from '../pages/Top';
import { Router } from 'react-router-dom';

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
