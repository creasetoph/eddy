import Ember from 'ember';
import _ from 'lodash';
import CondensedConfig from './condensed-config';
import FullConfig from './full-config';
import localStorage from './local-storage';
import config from '../config/environment';


export default Ember.Object.extend({
  routes: null,
  config: null,
  init() {
    this.set('routes', []);
  },
  nestedRoutes() {
    const obj = {};
    function setNest(route) {
      const r = _.get(obj, route);
      if (!r) {
        _.set(obj, route);
      }
    }
    _.each(this.get('routes'), setNest);
    return obj;
  },
  getConfig() {
    const eddyConfig = this.get('config');
    if (_.isNull(eddyConfig)) {
      return this.expandCondensed(config.eddyConfig)
        .then(this.processConfig)
        .then(finalConfig => {
          this.set('config', finalConfig);
          console.log('Eddy Config', finalConfig);
          return finalConfig;
        });
    }
    return Promise.resolve(eddyConfig);
  },
  expandCondensed(condensed) {
    return CondensedConfig.process(condensed);
  },
  processConfig(config) {
    return FullConfig.create(config).get('root');
  }
}).create();