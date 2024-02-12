import { getInput } from '@actions/core';

import { ObjectType } from '#/utils/actions-toolkit/actions-toolkit.types';

function inputProxy() {
  return new Proxy<ObjectType>({} as ObjectType, {
    get(_, name: string) {
      return getInput(name);
    },
  });
}

export default inputProxy;
