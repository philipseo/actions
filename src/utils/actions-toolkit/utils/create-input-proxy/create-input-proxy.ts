import { CreateInputProxyProps } from '#/utils/actions-toolkit/utils/create-input-proxy/create-input-proxy.types';
import { getInput } from '@actions/core';

function createInputProxy() {
  return new Proxy<CreateInputProxyProps>({} as CreateInputProxyProps, {
    get(_, name: string) {
      return getInput(name);
    },
  });
}

export default createInputProxy;
