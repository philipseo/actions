import { MOCK_ERROR_MESSAGE } from '#/__mocks__';
import { getErrorMessage } from '#/utils';
import { DEFAULT_ERROR_MESSAGE } from '#/utils/get-error-message/get-error-message.constants';

describe('getErrorMessage', () => {
  test('✅ should return the error message if the error is an instance of Error', () => {
    const error = new Error(MOCK_ERROR_MESSAGE);
    const errorMessage = getErrorMessage(error);

    expect(errorMessage).toBe(MOCK_ERROR_MESSAGE);
  });

  test('✅ should return the error message if the error is a string', () => {
    const errorMessage = getErrorMessage(MOCK_ERROR_MESSAGE);

    expect(errorMessage).toBe(MOCK_ERROR_MESSAGE);
  });

  test('✅ should return "Unknown error" if the error is neither an instance of Error nor a string', () => {
    const error = 123;
    const errorMessage = getErrorMessage(error as unknown);

    expect(errorMessage).toBe(DEFAULT_ERROR_MESSAGE);
  });
});
