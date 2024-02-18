import * as core from '@actions/core';

import { createOutputProxy } from '#/utils/actions-toolkit/utils';

jest.mock('@actions/core');

describe('createOutputProxy', () => {
  test('✅ should set the output value', () => {
    jest.spyOn(core, 'setOutput');

    const outputProxy = createOutputProxy();

    outputProxy.key1 = 'value1';
    outputProxy.key2 = 'value2';

    expect(core.setOutput).toHaveBeenCalledTimes(2);
    expect(core.setOutput).toHaveBeenCalledWith('key1', 'value1');
    expect(core.setOutput).toHaveBeenCalledWith('key2', 'value2');
  });
});
