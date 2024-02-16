import fs from 'node:fs';

import { Context } from '#/utils/actions-toolkit/utils';
import {
  GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE,
  PULL_REQUEST_NOT_FOUND_MESSAGE,
  REPOSITORY_NOT_FOUND_MESSAGE,
} from '#/utils/actions-toolkit/utils/context/context.constants';

const mockPayload = {
  repository: { owner: { login: 'owner' }, name: 'repo' },
  pull_request: {},
};

jest.mock('node:fs', () => {
  return {
    readFileSync: jest.fn().mockImplementation(() => {
      return JSON.stringify(mockPayload);
    }),
  };
});

describe('Context', () => {
  let context: Context;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GITHUB_EVENT_PATH = '/path/to/github/event.json';
    context = new Context();
  });

  test('✅ should return the payload if GITHUB_EVENT_PATH is set', () => {
    const contextPayload = context.payload;

    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/path/to/github/event.json',
      'utf8',
    );
    expect(contextPayload).toEqual(mockPayload);
  });

  test('✅ should return repository information from payload if environment variables are not set', () => {
    expect(context.repository).toEqual({
      owner: mockPayload.repository.owner.login,
      repo: mockPayload.repository.name,
    });
  });

  test('✅ should return pull request information if present in the payload', () => {
    expect(context.pullRequest).toEqual(mockPayload.pull_request);
  });

  test('❗ should throw an error if GITHUB_EVENT_PATH is not set', () => {
    delete process.env.GITHUB_EVENT_PATH;

    expect(() => context.payload).toThrow(GITHUB_EVENT_PATH_NOT_FOUND_MESSAGE);
  });

  test('❗should throw an error if neither environment variables nor payload contain repository information', () => {
    jest.spyOn(context, 'payload', 'get').mockReturnValueOnce(() => {
      return {};
    });

    expect(() => context.repository).toThrow(REPOSITORY_NOT_FOUND_MESSAGE);
  });

  test('❗ should throw an error if pull request information is not present in the payload', () => {
    jest.spyOn(context, 'payload', 'get').mockReturnValueOnce(() => {
      return {};
    });

    expect(() => context.pullRequest).toThrow(PULL_REQUEST_NOT_FOUND_MESSAGE);
  });
});
