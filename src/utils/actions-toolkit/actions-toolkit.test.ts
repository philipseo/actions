import { setFailed } from '@actions/core';

import { MOCK_ERROR_MESSAGE, MOCK_TOOLKIT_CONTEXT } from '#/constants';
import { MOCK_GITHUB_TOKEN } from '#/constants/mock';
import { ActionsToolkit } from '#/utils';

jest.mock('@actions/core');
jest.mock('#/utils/actions-toolkit/utils', () => {
  return {
    ...jest.requireActual('#/utils/actions-toolkit/utils'),
    Context: jest.fn().mockReturnValue(MOCK_TOOLKIT_CONTEXT),
    createInputProxy: jest
      .fn()
      .mockReturnValue({ 'github-token': MOCK_GITHUB_TOKEN }),
    createOutputProxy: jest.fn().mockReturnValue({}),
  };
});
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
    expect(toolkit.context).toBe(MOCK_TOOLKIT_CONTEXT);
    expect(toolkit.github).toBeInstanceOf(Object);
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
