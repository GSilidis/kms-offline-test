const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  css: { extract: false },
  configureWebpack: (config) => {
    config.optimization.runtimeChunk = {
      name({ name }) {
        if (name === '../sw') {
          return null;
        } else {
          return `runtime-${name}`;
        }
      },
    };

    config.optimization.splitChunks.chunks = ({ name }) => {
      return name !== '../sw';
    };
  },
  chainWebpack: (config) => {
    config.entry('../sw').add('./offline/sw/index.ts').end();
  },
});
