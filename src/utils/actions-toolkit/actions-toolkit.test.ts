import { setFailed } from '@actions/core';

import { MOCK_ERROR_MESSAGE } from '#/constants';
import { MOCK_GITHUB_TOKEN } from '#/constants/mock';
import { ActionsToolkit } from '#/utils';

jest.mock('@actions/core');
jest.mock('#/utils/node-exit');
jest.mock('#/utils/actions-toolkit/utils/context/context');
jest.mock(
  '#/utils/actions-toolkit/utils/create-input-proxy/create-input-proxy',
  () => {
    return jest.fn().mockReturnValue({ 'github-token': MOCK_GITHUB_TOKEN });
  },
);
jest.mock(
  '#/utils/actions-toolkit/utils/create-output-proxy/create-output-proxy',
  () => {
    return jest.fn().mockReturnValue({});
  },
);
jest.spyOn(process, 'exit').mockImplementation();

describe('ActionsToolkit', () => {
  const toolkit: ActionsToolkit = new ActionsToolkit();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should initialize with inputs, outputs, token, github, context, and nodeExit', () => {
    expect(toolkit.inputs).toEqual({ 'github-token': MOCK_GITHUB_TOKEN });
    expect(toolkit.outputs).toEqual({});
    expect(toolkit.token).toBe(MOCK_GITHUB_TOKEN);
    expect(toolkit.github).toBeInstanceOf(Object);
    expect(toolkit.context).toBeInstanceOf(Object);
  });

  test('✅ should handle success', () => {
    toolkit.success();

    expect(process.exit).toHaveBeenCalled();
  });

  test('❗ should handle failure', () => {
    const error = new Error(MOCK_ERROR_MESSAGE);
    toolkit.failure(error);

    expect(setFailed).toHaveBeenCalledWith(MOCK_ERROR_MESSAGE);
    expect(process.exit).toHaveBeenCalled();
  });
});
