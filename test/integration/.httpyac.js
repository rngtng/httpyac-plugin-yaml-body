const plugin = require("../../src/index");

module.exports = {
  configureHooks: function (api) {
    plugin(api);
	}
}