module.exports = (request) => {
  const YAML = require("yaml"),
  contentTypeKey = "Content-Type",
  jsonContentTypes = ["application/json", "application/vnd.api+json"];

  function getHeader(headers, headerName) {
    if (headers) {
      const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === headerName.toLowerCase());
      if (entry && entry.length > 1) {
        return entry[1];
      }
    }
    return undefined;
  }

  function isJsonOrNoContentType(contentType) {
    return !(contentType && !jsonContentTypes.includes(contentType))
  }

  function isString(string) {
    return (typeof string === 'string' || string instanceof String)
  }

  function hasYamlHeader(string) {
    return string.split(/\r?\n/)[0] === '---';
  }

  const contentType = getHeader(request.headers, contentTypeKey);

  if (isJsonOrNoContentType(contentType) && isString(request.body) && hasYamlHeader(request.body)) {
    if(!contentType) {
     request.headers[contentTypeKey] = jsonContentTypes[0];
    }
    request.body = JSON.stringify(YAML.parse(request.body));
  }
}
