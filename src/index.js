import onRequestHook from './onRequestHook';

export default (api) => {
  api.hooks.onRequest.addHook("parseYamlBody", onRequestHook);
};
