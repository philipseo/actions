import { ObjectType } from '#/utils/actions-toolkit/actions-toolkit.types';
import { setOutput } from '@actions/core';

function createOutputProxy() {
  return new Proxy<ObjectType>({} as ObjectType, {
    set(originalObject: ObjectType, name: string, value: string) {
      setOutput(name, value);
      originalObject[name] = value;

      return true;
    },
  });
}

export default createOutputProxy;
