module.exports = function override(config, env) {
  // ts-loader 추가 예시
  config.module.rules.push({
    test: /\.ts(x?)$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  });
  console.log('Webpack config is being overridden');
  return config;
};
