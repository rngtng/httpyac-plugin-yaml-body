const  { cli, io } = require('httpyac'),
path = require('path'),
mockServer = require("mockttp").getLocal();

describe('yaml body', () => {
  beforeEach(() => mockServer.start(8080));
  afterEach(() => mockServer.stop());
  jest.spyOn(process, 'exit').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();

  function exec(name){
    return cli.execute([
      '',
      '',
      path.join(__dirname, '/test.http'),
      '-n', name
    ]);
  }

  it('parsed body as json', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await exec('withYaml');

    const requests = await endpointMock.getSeenRequests();
    expect(requests[0].body.text).toEqual("{\"id\":1}");
    expect(requests[0].headers['content-type']).toEqual("application/json");
  });

  it('keeps json', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await exec('withJson');

    const requests = await endpointMock.getSeenRequests();
    expect(requests[0].body.text).toEqual("{\n  \"id\": 1\n}");
  });

  it('keeps yaml', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await exec('withEnforcedYaml');

    const requests = await endpointMock.getSeenRequests();
    expect(requests[0].body.text).toEqual("---\nid: 1");
  });

  it('keeps yaml when lowercase header', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await exec('withEnforcedYamlAndLowercaseHeader');

    const requests = await endpointMock.getSeenRequests();
    expect(requests[0].body.text).toEqual("---\nid: 1");
  });

  it('keeps yaml when alternative yaml content-type', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await exec('withEnforcedYamlAlternativeContentType');

    const requests = await endpointMock.getSeenRequests();
    expect(requests[0].body.text).toEqual("---\nid: 1");
  });
});