define([], function(){
  'use strict';

  var uri = 'https://us.api.battle.net/wow/';
  var key = 'ubph89vx2bks3yhk26rmhytyqndw2c3m';
  var locale = 'en_US';

  var api = {};

  api.get = function(path, params, fn){
    $.isArray(path) && (path = path.join('/'));
    $.isArray(params) && (params = params.join('&'));
    params += '&locale=' + locale + '&apikey=' + key;
    $.get(uri + path + '?' + params, fn);
  };

  return api;

});
