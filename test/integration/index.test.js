const  { cli } = require('httpyac'),
path = require('path'),
mockServer = require("mockttp").getLocal();

describe('httpyac-plugin-yaml-body', () => {
  beforeEach(() => mockServer.start(8080));
  afterEach(() => mockServer.stop());

  jest.spyOn(process, 'exit').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();

  it('parsed body as json', async () => {
    const endpointMock = await mockServer.post("/").thenReply(200, "OK");

    await cli.execute([
      '',
      '',
      path.join(__dirname, '/test.http'),
      '-n', 'withYaml'
    ]);

    const requests = await endpointMock.getSeenRequests();
    expect(await requests[0].body.getJson()).toEqual({id:1});
    expect(requests[0].headers['content-type']).toEqual("application/json");
  });
});