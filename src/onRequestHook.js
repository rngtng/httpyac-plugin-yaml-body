module.exports = (request) => {
  const YAML = require("yaml"),
  contentTypeKey = "Content-Type";

  function hasContentTypeKey(headers) {
    if (headers) {
      console.log(headers);
      const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === contentTypeKey.toLowerCase());
      if (entry && entry.length > 1) {
        return true;
      }
    }
    console.log("GALSE");
    return false;
  }

  function hasYamlHeader(string) {
    return string.split('\n')[0] === '---';
  }

  if (!hasContentTypeKey(request.headers) && hasYamlHeader(request.body)) {
    request.headers[contentTypeKey] = "application/json";
    request.body = JSON.stringify(YAML.parse(request.body));
  }
}
