import { getInput } from '@actions/core';

import { createInputProxy } from '#/utils/actions-toolkit/utils';

type MockedInputValues = {
  [key: string]: string;
};

const mockedInputValues: MockedInputValues = {
  key1: 'value1',
  key2: 'value2',
};

jest.mock('@actions/core', () => {
  return {
    getInput: jest.fn().mockImplementation((name) => {
      return mockedInputValues[name];
    }),
  };
});

describe('inputProxy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should return the input value', () => {
    const inputProxy = createInputProxy();

    expect(inputProxy.key1).toBe('value1');
    expect(inputProxy.key2).toBe('value2');
    expect(getInput).toHaveBeenCalledTimes(2);
    expect(getInput).toHaveBeenCalledWith('key1');
    expect(getInput).toHaveBeenCalledWith('key2');
  });

  test('✅ should return undefined for undefined input values', () => {
    const inputProxy = createInputProxy();

    expect(inputProxy.key3).toBeUndefined();

    expect(getInput).toHaveBeenCalledTimes(1);
    expect(getInput).toHaveBeenCalledWith('key3');
  });
});
