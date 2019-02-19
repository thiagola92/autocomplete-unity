'use babel';

import unityProvider from './unity-provider';

export default {

  getProvider() {
      // return a single provider, or an array of providers to use together
      return [unityProvider];
  }
};
