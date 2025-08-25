import * as path from 'path';
import type { Plugin } from '@ice/app/types';

const plugin: Plugin = () => ({
  name: 'my-plugin',
  setup: (pluginAPI) => {
    console.log(2, pluginAPI);
  },
  // runtime 为可选，用于定制运行时配置。runtime 的值必须是一个绝对路径
  runtime: path.join(__dirname, 'runtime.tsx'),
});

export default plugin;