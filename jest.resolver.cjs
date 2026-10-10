// @actions/* and @octokit/* (and some of their deps) export only the "import" condition
const ESM_ONLY = /^@(actions|octokit)\//;
const FROM_ESM_ONLY =
  /[\\/]node_modules[\\/](\.pnpm[\\/])?@(actions|octokit)[+\\/]/;

module.exports = (request, options) => {
  if (ESM_ONLY.test(request) || FROM_ESM_ONLY.test(options.basedir)) {
    return options.defaultResolver(request, {
      ...options,
      conditions: [...(options.conditions ?? []), 'import'],
    });
  }
  return options.defaultResolver(request, options);
};
