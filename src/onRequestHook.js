module.exports = (request) => {
  const YAML = require("yaml"),
  contentTypeKey = "Content-Type";

  function hasContentTypeKey(headers) {
    if (headers) {
      const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === contentTypeKey.toLowerCase());
      if (entry && entry.length > 1) {
        return true;
      }
    }
    return false;
  }

  function isString(string) {
    return (typeof string === 'string' || string instanceof String)
  }

  function hasYamlHeader(string) {
    return string.split('\n')[0] === '---';
  }

  if (!hasContentTypeKey(request.headers) && isString(request.body) && hasYamlHeader(request.body)) {
    request.headers[contentTypeKey] = "application/json";
    request.body = JSON.stringify(YAML.parse(request.body));
  }
}
