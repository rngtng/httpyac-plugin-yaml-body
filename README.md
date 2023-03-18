# httpyac-plugin-yaml-body

[HttpYac plugin](https://httpyac.github.io) to enable yaml notation for sending JSON request bodies. Pure syntactic sugar!

[![build](https://github.com/rngtng/httpyac-plugin-yaml-body/actions/workflows/main.yml/badge.svg)](https://github.com/rngtng/httpyac-plugin-yaml-body/actions/workflows/main.yml)

## Installation

```
npm install httpyac-plugin-yaml-body --save
```

## Usage

Plugin adds syntactic sugar to ease dealing with JSON bodies. With the plugin, the body can be in yaml
format, which will be converted to JSON before the request is send. The correct Content-Type `application/json` will be set too, if not yet provided.
Ensure the first body line contains the yaml header to detect the format. Example:

```
POST http://localhost:8080
---
id: 1
```

gets translated to

```
POST http://localhost:8080
Content-Type: application/json
{
  "id": 1
}
```

### Enforce Yaml

In case of a `Content-Type` header besides `application/json` or `application/vnd.api+json` is present, no conversion happens, even body is yaml.
