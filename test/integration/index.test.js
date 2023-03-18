const httpyac = require('httpyac'),
 fs = require('fs/promises'),
 mockServer = require("mockttp").getLocal(),
 path = require('path');

function initFileProvider() {
  const fileProvider = httpyac.io.fileProvider,
  { join, isAbsolute, dirname, extname } = path;

  fileProvider.isAbsolute = async (fileName) => isAbsolute(fileProvider.toString(fileName));
  fileProvider.dirname = (fileName) => dirname(fileProvider.toString(fileName));
  fileProvider.hasExtension = (fileName, ...extensions) =>
    extensions.indexOf(extname(fileProvider.toString(fileName))) >= 0;
    fileProvider.joinPath = (fileName, path) =>
    join(fileProvider.toString(fileName), path);
  fileProvider.exists = async (fileName) => {
    try {
      return !!(await fs.stat(fileProvider.toString(fileName)));
    } catch (err) {
      return false;
    }
  };
  fileProvider.readdir = async (dirname) =>
    fs.readdir(fileProvider.toString(dirname));
}

describe('httpyac-plugin-yaml-body', () => {
  beforeAll(initFileProvider);
  beforeEach(() => mockServer.start(8080));
  afterEach(() => mockServer.stop());

  it('parsed body as json', async () => {
    const endpointMock = await mockServer.forPost("/").thenReply(200, "OK"),
     httpFile = await new httpyac.store.HttpFileStore().getOrCreate(
      'test.http',
      async () => await fs.readFile(path.join(__dirname, '/test.http'), 'utf8'),
      0,
      {
        workingDir: __dirname,
      }
    );

    await httpyac.send({
      httpFile
    });

    const requests = await endpointMock.getSeenRequests();
    expect(await requests[0].body.getJson()).toEqual({id:1});
    expect(requests[0].headers['content-type']).toEqual("application/json");
  });


  it('parsed body as json with special content type', async () => {
    const endpointMock = await mockServer.forPost("/").thenReply(200, "OK"),
     httpFile = await new httpyac.store.HttpFileStore().getOrCreate(
      'test.http',
      async () => await fs.readFile(path.join(__dirname, '/test2.http'), 'utf8'),
      0,
      {
        workingDir: __dirname,
      }
    );

    await httpyac.send({
      httpFile
    });

    const requests = await endpointMock.getSeenRequests();
    expect(await requests[0].body.getJson()).toEqual({id:1});
    expect(requests[0].headers['content-type']).toEqual("application/vnd.api+json");
  });
});
