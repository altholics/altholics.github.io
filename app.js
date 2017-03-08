define(['toon', 'template7'], function(Toon, T7){
  'use strict';

  var App = function(){
    this.loaded = this.loaded.bind(this);
    this._toons = [];
    this._fetched = 0;

    this.addCharacter('Ysera', 'Pelì');
    this.addCharacter('Ysera', 'Tufie');
    this.addCharacter('Ysera', 'Nazuki');
    this.addCharacter('Ysera', 'Skewered');
    this.addCharacter('Ysera', 'Plynk');
  };

  App.prototype.addCharacter = function(realm, name){
    var toon = new Toon(realm, name);
    this._toons.push(toon);

    toon.fetch()
      .on('change', this.loaded);
  };

  App.prototype.showOverview = function(fn){
    $.get('tmpl/overview.html', function(data){
      this._overviewShown = true;
      var tmpl = T7.compile(data);
      var html = tmpl();
      $('body').prepend(html);
      fn();
    });
  };

  App.prototype.loaded = function(){
    if (++this._fetched === this._toons.length && !this._overviewShown){
      this.showOverview(this.loaded);
      return;
    }

    $.get('tmpl/overview-toon.html', function(data){
      var tmpl = T7.compile(data);

      this._toons.forEach(function(toon){
        var html = tmpl(toon.toJSON());
        $('#overview .row').append(html);
      });
    }.bind(this));
  };

  return App;
});
