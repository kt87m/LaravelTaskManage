import { AxiosError } from 'axios';
import React from 'react';
import { ApiError } from '../types/api';

type Props = { error: AxiosError<ApiError> };

export const Errors: React.FC<Props> = ({ error }) => (
  <>
    {Object.values(error.response!.data.errors).map((errors) =>
      errors.map((message) => (
        <p key={message} className="text-red-600">
          {message}
        </p>
      ))
    )}
  </>
);
