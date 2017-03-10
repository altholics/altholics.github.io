define(['lil-event', 'api', 'data', 'quest-chain'], function(lil, Api, Data, QuestChain){
  'use strict';

  var ACHIEVS = ['loremaster', 'azsuna', 'valshara', 'highmountain', 'stormheim', 'suramar', 'insurrection'];
  var UNLOCKS = ['arccos', 'karazhan'];

  function Toon(realm, name){
    this.realm = realm;
    this.name = name;
    this.achievs = {};
    this.unlocks = {};
    this.appearances = {};
    this.data = {
      name: this.name,
      realm: this.realm,
      achievs: this.achievs,
      unlocks: this.unlocks,
      artifact: this.appearances
    };

    this.handleResponse = this.handleResponse.bind(this);
  };

  Toon.prototype = Object.create(lil.Event.prototype);

  Toon.prototype.fetch = function(){
    Api.get(['character', this.realm, this.name], ['fields=achievements,professions,progression,quests,reputation'], this.handleResponse);
    return this;
  };

  Toon.prototype.handleResponse = function(json){
    this.json = json;

    for (var a in ACHIEVS){
      this.achievs[ACHIEVS[a]] = json.achievements.achievementsCompleted.indexOf(Data.achievements[ACHIEVS[a]]) >= 0;
    }

    for (var u in UNLOCKS){
      this.unlocks[UNLOCKS[u]] = json.quests.indexOf(Data.quests[UNLOCKS[u]]) >= 0;
    }

    for (var p in Data.professions){
      if (json.professions.primary[0].id == Data.professions[p]){
        this.data.prof1 = {
          name: json.professions.primary[0].name,
          quests: new QuestChain(Data.prof_quests[p], json.quests)
        };
      }
      else if (json.professions.primary[1].id == Data.professions[p]){
        this.data.prof2 = {
          name: json.professions.primary[1].name,
          quests: new QuestChain(Data.prof_quests[p], json.quests)
        };
      }
    }

    this.appearances.balance_of_power = new QuestChain(Data.balance_of_power, json.quests);

    this.emit('change');
  };

  Toon.prototype.toJSON = function(){
    return this.data;
  };

  return Toon;

});
