define(['lil-event', 'api', 'data', 'quest-chain'], function(lil, Api, Data, QuestChain){
  'use strict';

  var ACHIEVS = ['loremaster', 'azsuna', 'valshara', 'highmountain', 'stormheim', 'suramar', 'insurrection'];
  var UNLOCKS = ['arccos', 'karazhan'];

  var Toon = function(realm, name){
    this.realm = realm;
    this.name = name;
  };

  Toon.prototype = Object.create(lil.Event.prototype);

  Toon.prototype.fetch = function(){
    Api.get(['character', this.realm, this.name], ['fields=achievements,professions,progression,quests,reputation'], this.handleResponse);
    return this;
  };

  Toon.prototype.handleResponse = function(json){
    this.json = json;

    this.achievs = {};
    for (var a in ACHIEVS){
      this.achievs[a] = json.achievements.achievementsCompleted.indexOf(Data.achievements[a]) >= 0;
    }

    this.unlocks = {};
    for (var u in UNLOCKS){
      this.unlocks[u] = json.quests.indexOf(Data.quests[u]) >= 0;
    }

    for (var p in Data.professions){
      if (json.professions.primary[0].id == Data.professions[p]){
        this.prof1 = json.professions.primary[0].name;
        this.prof1_quests = new QuestChain(Data.prof_quests[p], json.quests);
      }
      else if (json.professions.primary[1].id == Data.professions[p]){
        this.prof2 = json.professions.primary[1].name;
        this.prof2_quests = new QuestChain(Data.prof_quests[p], json.quests);
      }
    }

    this.appearances = {};
    this.appearances.balance_of_power = new QuestChain(Data.balance_of_power, json.quests);

    this.emit('change');
  };

  Toon.prototype.toJSON = function(){
    var json = {achievs: this.achievs, unlocks: this.unlocks};

    return json;
  };

  return Toon;

});
