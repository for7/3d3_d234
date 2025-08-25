/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'ice';
import { Config } from '@/interfaces/config';

interface ModelState {
  config: Config;
}

export default createModel({
  state: {
    config: {
      isDev: process.env.NODE_ENV === 'development',
      isTest: process.env.NODE_ENV === 'test',
      isProd: process.env.NODE_ENV === 'production',
    },
  } as ModelState,
  reducers: {
    updateConfig(prevState: ModelState, payload: Config) {
      prevState.config = payload;
    },
  },
});
