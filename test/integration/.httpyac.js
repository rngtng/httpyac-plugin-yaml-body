import plugin from '../../src/index';

export default {
  configureHooks: function (api) {
    plugin(api);
	}
}