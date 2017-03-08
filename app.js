define(['toon', 'template7'], function(Toon, T7){
  'use strict';

  var App = function(){
    this.toons = 4;
    new Toon('Ysera', 'Pelì').fetch().on('change', this.loaded);
    new Toon('Ysera', 'Tufie').fetch().on('change', this.loaded);
    new Toon('Ysera', 'Nazuki').fetch().on('change', this.loaded);
    new Toon('Ysera', 'Skewered').fetch().on('change', this.loaded);
  };

  App.prototype.showOverview = function(){
    $.get('tmpl/overview.html', function(data){
      var tmpl = T7.compile(data);
      var html = tmpl();
      $('body').prepend(html);
    });
  };

  App.prototype.loaded = function(){
    this.toons--;
    this.toons || this.showOverview();
  };

  return App;
});
