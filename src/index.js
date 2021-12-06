module.exports = (api) => {
  api.hooks.onRequest.addHook("parseYamlBody", require('./onRequestHook'));
};
