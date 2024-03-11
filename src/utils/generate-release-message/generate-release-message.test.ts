import { MOCK_TOOLKIT_CONTEXT } from '#/__mocks__';
import { generateReleaseMessage } from '#/utils';
import { DEFAULT_BUMP_MESSAGE } from '#/utils/generate-release-message/generate-release-message.constants';

describe('generateReleaseMessage', () => {
  test('✅ should generate major release message if PR title starts with "major"', () => {
    const mockTitle = 'major: update';
    const mockContext = {
      ...MOCK_TOOLKIT_CONTEXT,
      pullRequest: {
        ...MOCK_TOOLKIT_CONTEXT.pullRequest,
        title: mockTitle,
      },
    };
    const props = { context: mockContext, isBumpVersion: false };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const message = generateReleaseMessage(props);

    expect(message).toContain('Major Changes');
    expect(message).toContain(mockTitle);
    expect(message).toContain('#123');
  });

  test('✅ should generate minor release message if PR title starts with "minor"', () => {
    const mockTitle = 'minor: update';
    const mockContext = {
      ...MOCK_TOOLKIT_CONTEXT,
      pullRequest: {
        ...MOCK_TOOLKIT_CONTEXT.pullRequest,
        title: mockTitle,
      },
    };
    const props = { context: mockContext, isBumpVersion: false };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const message = generateReleaseMessage(props);

    // Assert
    expect(message).toContain('Minor Changes');
    expect(message).toContain(mockTitle);
    expect(message).toContain(`#${mockContext.pullRequest.number}`);
  });

  test('✅ should generate patch release message if PR title does not start with major or minor', () => {
    const mockTitle = 'fix: update';
    const mockContext = {
      ...MOCK_TOOLKIT_CONTEXT,
      pullRequest: {
        ...MOCK_TOOLKIT_CONTEXT.pullRequest,
        title: mockTitle,
      },
    };
    const props = { context: mockContext, isBumpVersion: false };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const message = generateReleaseMessage(props);

    // Assert
    expect(message).toContain('Patch Changes');
    expect(message).toContain(mockTitle);
    expect(message).toContain(`#${mockContext.pullRequest.number}`);
  });

  test('✅ should include default bump message if isBumpVersion is true', () => {
    const mockTitle = 'bump: update';
    const mockContext = {
      ...MOCK_TOOLKIT_CONTEXT,
      pullRequest: {
        ...MOCK_TOOLKIT_CONTEXT.pullRequest,
        title: mockTitle,
      },
    };
    const props = { context: mockContext, isBumpVersion: true };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const message = generateReleaseMessage(props);

    // Assert
    expect(message).toContain('Patch Changes');
    expect(message).toContain(DEFAULT_BUMP_MESSAGE);
    expect(message).toContain(`#${mockContext.pullRequest.number}`);
  });
});
