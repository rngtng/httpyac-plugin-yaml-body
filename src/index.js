module.exports = (api) => {
  const YAML = require("yaml");

  // application/x-yaml with an alternative of text/yaml
  function isYamlContent(string) {
    return string == 'application/x-yaml'
  }

  function isYaml(string) {
    return string.split('\n')[0] == '---'
  }

  api.hooks.onRequest.addHook("signRequest", (request, context) => {
    var { headers, body } = request;
    if (!isYamlContent(headers['content-type']) && isYaml(body)) {
      response.headers["content-type"] = "application/json";
      request.body = JSON.stringify(YAML.parse(body));
    }
  });
};
