import * as core from '@actions/core';

import inputProxy from '#/utils/actions-toolkit/utils/input-proxy/input-proxy';

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
    const proxy = inputProxy();

    expect(proxy.key1).toBe('value1');
    expect(proxy.key2).toBe('value2');
    expect(core.getInput).toHaveBeenCalledTimes(2);
    expect(core.getInput).toHaveBeenCalledWith('key1');
    expect(core.getInput).toHaveBeenCalledWith('key2');
  });

  test('✅ should return undefined for undefined input values', () => {
    const proxy = inputProxy();

    expect(proxy.key3).toBeUndefined();

    expect(core.getInput).toHaveBeenCalledTimes(1);
    expect(core.getInput).toHaveBeenCalledWith('key3');
  });
});
