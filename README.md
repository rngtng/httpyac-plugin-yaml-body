# httpyac-plugin-yaml-body

HttpYac plugin to enable yaml notation for sending JSON request bodies. Pure syntactic sugar!

## Installation

```
npm install httpyac-plugin-yaml-body --save
```

## Usage

Plugin adds syntactic sugar to ease dealing with JSON bodies. With the plugin, the body can be in yaml
format, which will be converted to JSON before the request is send. The correct Content-Type `application/json` will be set too.
Ensure the first body line contains the yaml header to detect the format. Example:

```
POST http://localhost:8080
---
id: 1
```

gets translated to

```
POST http://localhost:8080
Conten-Type: application/json
{
  "id": 1
}
```

### Enforce yaml

In case of `Content-Type` header is expliclit set to `application/x-yaml`, no conversion happens