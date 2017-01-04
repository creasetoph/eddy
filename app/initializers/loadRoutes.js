import Ember from 'ember';
import _ from 'lodash/lodash';
import GenericForm from '../controllers/generic-form';
import apiConfig from '../helpers/api-config';

export default {
  name       : 'load-dynamic-routes',
  restActions: ['list', 'create', 'edit', 'view'],
  initialize(application) {
    var self = this;
    application.deferReadiness();
    apiConfig.getConfig('/config.json').then(api => {
      _.map(api.get('endpoints'), function (routeDef, route) {
        self.registerComponents(routeDef, route, application);
      });
      self.setUpInjections(application,api);
      application.advanceReadiness();
    });
  },
  registerComponents(routeDef, route, application) {
    console.debug('Registering route [' + route + ']');
    if (routeDef.type === 'rest') {
      this.registerRest(routeDef, route, application);
    } else {
      this.registerAll(routeDef, route, application, routeDef.method);
    }
  },
  setUpInjections(application,api) {
    application.register('config:main',api,{ instantiate: false });
    application.inject('component','globalConfig','config:main');
    application.inject('controller','globalConfig','config:main');
    application.inject('route','globalConfig','config:main');
  },
  registerRest(routeDef, route, application) {
    //This is the base page of the rest tab
    this.registerRestRoute(routeDef, route, application);
    //These are the actual rest tabs
    this.registerListRoute(routeDef, route, application);
    this.registerCreateRoute(routeDef, route, application);
    this.registerEditRoute(routeDef, route, application);
    this.registerViewRoute(routeDef, route, application);
  },
  registerRestRoute(routeDef, route, application) {
    application.register('route:' + route, Ember.Route.extend({
      renderTemplate() {
        this.render('components/rest-container');
      },
      redirect() {
        this.transitionTo(route + '.list');
      }
    }));
  },
  registerListRoute(routeDef, route, application) {
    this.registerAll(this.genRouteDef(routeDef, 'listable'), route + '.list', application, 'GET');
  },
  registerCreateRoute(routeDef, route, application) {
    this.registerAll(routeDef, route + '.create', application, 'POST');
  },
  /**
   * The edit route is special since we need to preload data for the form, so we need to
   * first go get the data from the `view` endpoint, then display the form as normal
   */
  registerEditRoute(routeDef, route, application) {
    this.registerAll(this.genRouteDef(routeDef, 'editable'), route + '.edit', application, 'PUT');
  },
  registerViewRoute(routeDef, route, application) {
    this.registerAll(this.genRouteDef(routeDef, 'viewable'), route + '.view', application, 'GET');
  },
  registerAll(routeDef, route, application, method) {
    this.registerRoute(routeDef, route, application, method, this.restModel);
    this.registerController(routeDef, route, application);
  },
  registerRoute(routeDef, route, application, method, modelFunc) {
    var self = this;
    application.register('route:' + route, Ember.Route.extend({
      renderTemplate() {
        this.render('components/generic-form');
      },
      model(params) {
        return modelFunc.call(self, routeDef, route, method, params, this);
      },
      setupController(controller, model) {
        controller.set('content', model);
      },
      afterModel() {
      },
      activate() {
        console.debug('Entering route [' + route + ']');
        this._super();
      }
    }));
  },
  registerController(routeDef, route, application) {
    var qp = _.map(routeDef.fields, 'name');
    qp.push('as');
    application.register('controller:' + route, GenericForm.extend({
      queryParams: qp
    }));
  },
  setUpRestModel(routeDef, route, method, params) {
    var m = _.cloneDeep(routeDef);
    if (!m.routeName) {
      m.routeName = route;
    }
    m.submitDisplay = this.getSubmitDisplay(route);
    m.additionalActions = this.getAdditionalAction(route);
    m.params = params;
    m.method = method;
    return m;
  },
  restModel(routeDef, route, method, params) {
    var m = this.setUpRestModel(routeDef, route, method, params);
    return new Ember.RSVP.Promise(function (resolve) {
      resolve(m);
    });
  },
  getAdditionalAction(route) {
    var n = route.split('.');
    if(route.endsWith('.list')) {
      return [{
        'display': 'Create',
        'link': _.head(n) + '.create'
      }];
    }
    return [];
  },
  getSubmitDisplay(route) {
    var n = route.split('.');
    if(n.length >= 2) {
      return _.capitalize(_.last(n));
    }
  },
  filterFields(routeDef, name) {
    if (routeDef[name]) {
      if (_.isString(_.first(routeDef[name]))) {
        return _.flatten(_.map(routeDef[name], l => _.filter(routeDef.fields, field => {
          return field.name === l;
        })));
      } else if (_.isObject(_.first(routeDef[name]))) {
        return routeDef[name];
      } else {
        return [];
      }
    }
    return routeDef.fields;
  },
  genRouteDef(routeDef, name) {
    var rd    = _.cloneDeep(routeDef);
    rd.fields = this.filterFields(routeDef, name);
    return rd;
  }
};