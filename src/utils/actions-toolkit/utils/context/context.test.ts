import fs from 'node:fs';

import { getErrorMessage } from '#/utils';
import { Context } from '#/utils/actions-toolkit/utils';
import { GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE } from '#/utils/actions-toolkit/utils/context/context.constants';

jest.mock('node:fs');

describe('Context', () => {
  const mockPayload = {
    pull_request: {},
  };
  let context: Context;

  beforeEach(() => {
    context = new Context();
  });

  it('✅ should return the payload if GITHUB_EVENT_PATH is set', () => {
    process.env.GITHUB_EVENT_PATH = '/path/to/github/event.json';

    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValueOnce(JSON.stringify(mockPayload));

    const contextPayload = context.payload;

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/github/event.json',
      'utf8',
    );
    expect(contextPayload).toEqual(mockPayload);
  });

  it('❗ should throw an error if GITHUB_EVENT_PATH is not set', () => {
    try {
      delete process.env.GITHUB_EVENT_PATH;

      const contextPayload = context.payload;
      expect(contextPayload).toEqual(mockPayload);
    } catch (error) {
      expect(getErrorMessage(error)).toBe(GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE);
    }
  });
});
