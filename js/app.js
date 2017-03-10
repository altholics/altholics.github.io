define(['toon', 'views/Overview'], function(Toon, View){
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

  App.prototype.loaded = function(){
    if (++this._fetched != this._toons.length){
      return;
    }

    View.render({
      toons: this._toons.map(function(t){ return t.toJSON(); })
    });
  };

  return App;
});
