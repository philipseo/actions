import { NODE_EXIT_CODE, NodeExit } from '#/utils/actions-toolkit/utils';

describe('NodeExit', () => {
  let nodeExit: NodeExit;

  beforeEach(() => {
    nodeExit = new NodeExit();
  });

  test('✅ should exit with success code', () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

    nodeExit.success();

    expect(processExitSpy).toHaveBeenCalledWith(NODE_EXIT_CODE.SUCCESS);
  });

  test('❗ should exit with failure code', () => {
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

    nodeExit.failure();

    expect(processExitSpy).toHaveBeenCalledWith(NODE_EXIT_CODE.FAILURE);
  });
});
