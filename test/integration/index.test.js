const { store, send, io } = require('httpyac'),
 httpFileStore = new store.HttpFileStore(),
 fs = require('fs/promises'),
 { join, isAbsolute, dirname, extname } = require('path'),
 mockServer = require("mockttp").getLocal();

function initFileProvider() {
  const fileProvider = io.fileProvider;

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

initFileProvider();

describe('httpyac-plugin-yaml-body', () => {
  beforeEach(() => mockServer.start(8080));
  afterEach(() => mockServer.stop());

  jest.spyOn(process, 'exit').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();

  it('parsed body as json', async () => {
    const endpointMock = await mockServer.forPost("/").thenReply(200, "OK"),
    fileName = 'test.http',
    httpFile = await httpFileStore.getOrCreate(
      fileName,
      async () => await fs.readFile(join(__dirname, '/test.http'), 'utf8'),
      0,
      {
        workingDir: __dirname,
      }
    );

    await send({
      httpFile
    });

    const requests = await endpointMock.getSeenRequests();
    expect(await requests[0].body.getJson()).toEqual({id:1});
    expect(requests[0].headers['content-type']).toEqual("application/json");
  });
});