import plugin from '../../src/index';

module.exports = {
  configureHooks: function (api) {
    plugin(api);
	}
}