import { ActionsToolkit } from '#/utils';

/**
 * Get existing pull request comment
 * @property {ActionsToolkit} toolkit - actions toolkit instance
 * @property {string} message - commit message
 */
export interface GetExistingPullRequestCommentProps {
  toolkit: ActionsToolkit;
  message: string;
}
