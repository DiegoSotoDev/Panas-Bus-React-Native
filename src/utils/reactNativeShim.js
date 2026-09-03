import * as RNW from 'react-native-web';

export * from 'react-native-web';

export const TurboModuleRegistry = {
  get: (name) => null,
  getEnforcing: (name) => ({}),
};

export default RNW.default || RNW;
