import onRequestHook from '../../src/onRequestHook';

describe('onRequestHook', () => {
  var request;

  beforeEach(() => {
    request = {
      headers: {},
      body: "---\nid: 1"
    }
  });

  it('parsed body as json', () => {
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":1}");
    expect(request.headers['Content-Type']).toEqual("application/json");
  });

  it('parsed body as json', () => {
    request.headers["Content-Type"] = "application/json";
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":1}");
    expect(request.headers['Content-Type']).toEqual("application/json");
  });

  it('keeps body when no yaml', () => {
    request.body = "{\"id\":1}";
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":1}");
  });

  it('keeps yaml when header', () => {
    request.headers["Content-Type"] = "application/x-yaml";

    onRequestHook(request);

    expect(request.headers['Content-Type']).toEqual("application/x-yaml");
    expect(request.body).toEqual("---\nid: 1");
  });

  it('keeps yaml when lowercase header', () => {
    request.headers['content-type'] = "text/yaml";

    onRequestHook(request);

    expect(request.body).toEqual("---\nid: 1");
  });

  it('skips empty body', () => {
    request.body = undefined;
    onRequestHook(request);

    expect(request.body).toEqual(undefined);
  });

  it('parses null', () => {
    request.body = "---\nid: null";
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":null}");
  });

  xit('parses float', () => {
    request.body = "---\nid: \"0.00001\"";
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":0.00001}");
  });

  it('parses hex', () => {
    request.body = "---\nid: \"0x0fC34BfA26D38494280681642A5E42733a084731\"";
    onRequestHook(request);

    expect(request.body).toEqual("{\"id\":\"0x0fC34BfA26D38494280681642A5E42733a084731\"}");
  });
});