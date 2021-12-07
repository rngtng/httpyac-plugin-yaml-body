module.exports = (request) => {
  const YAML = require("yaml"),
  contentTypeKey = "Content-Type",
  jsonContentType = "application/json";

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
    return !(contentType && contentType !== jsonContentType)
  }

  function isString(string) {
    return (typeof string === 'string' || string instanceof String)
  }

  function hasYamlHeader(string) {
    return string.split('\n')[0] === '---';
  }

  const contentType = getHeader(request.headers, contentTypeKey);

  if (isJsonOrNoContentType(contentType) && isString(request.body) && hasYamlHeader(request.body)) {
    if(contentType !== jsonContentType) {
     request.headers[contentTypeKey] = jsonContentType;
    }
    request.body = JSON.stringify(YAML.parse(request.body));
  }
}
