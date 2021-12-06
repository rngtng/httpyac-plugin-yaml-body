module.exports = (api) => {
  const YAML = require("yaml");

  function isYamlContent(headers) {
    var contentType = headers["Content-Type"] || headers["content-type"];
    return ((contentType === 'application/x-yaml') || (contentType === 'text/yaml'));
  }

  function isYaml(string) {
    return string.split('\n')[0] === '---';
  }

  api.hooks.onRequest.addHook("parseYamlBody", (request) => {
    var { headers, body } = request;
    if (!isYamlContent(headers) && isYaml(body)) {
      request.headers["Content-Type"] = "application/json";
      request.body = JSON.stringify(YAML.parse(body));
    }
  });
};
