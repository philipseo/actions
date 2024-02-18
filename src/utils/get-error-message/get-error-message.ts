import { DEFAULT_ERROR_MESSAGE } from '#/utils/get-error-message/get-error-message.constants';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return DEFAULT_ERROR_MESSAGE;
  }
}

export default getErrorMessage;
