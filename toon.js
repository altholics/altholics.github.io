define(['api', 'data', 'quest-chain'], function(Api, Data, QuestChain){
  'use strict';

  var ACHIEVS = ['loremaster', 'azsuna', 'valshara', 'highmountain', 'stormheim', 'suramar', 'insurrection'];
  var UNLOCKS = ['arccos', 'karazhan'];

  var Toon = function(realm, name){
    this.realm = realm;
    this.name = name;
  };

  Toon.prototype.fetch = function(){
    Api.get(['character', this.realm, this.name], ['fields=achievements,professions,progression,quests,reputation'], this.handleResponse);
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

    this.update(this.json); // back compat
  };

  Toon.prototype.toJSON = function(){
    var json = {achievs: this.achievs, unlocks: this.unlocks};

    return json;
  };

  Toon.prototype.update = function(json){
    $('table thead tr').append('<th>'+json.name+'</th>');
    ACHIEVS.forEach(function(ach){
      $('table tbody tr[data-id="achiev.'+ach+'"]')
      .append('<td class="'+ (
        json.achievements.achievementsCompleted.indexOf(Data.achievements[ach]) >= 0 ?
        'complete">Done' :
        'incomplete">In Progress'
      )+'</td>');
    });
    UNLOCKS.forEach(function(q){
      $('table tbody tr[data-id="unlock.'+q+'"]')
      .append('<td class="' + (
        json.quests.indexOf(Data.quests[q]) >= 0 ?
        'complete">Done' :
        'incomplete">In Progress'
      )+'</td>');
    });

    var prof_quests;
    var prof;
    for (var p in Data.professions){
      if (json.professions.primary[0].id == Data.professions[p]){
        prof_quests = Data.prof_quests[p];
        prof = json.professions.primary[0].name;
        break;
      }
    }
    var done = prof_quests.every(function(q){
      return json.quests.indexOf(q) >= 0;
    });
    $('table tbody tr[data-id="profession0"]')
    .append('<td class=' + (
      done ?
      'complete">Done' :
      'incomplete">In Progress'
    ) + '</td>');

    for (p in Data.professions){
      if (json.professions.primary[1].id == Data.professions[p]){
        prof_quests = Data.prof_quests[p];
        prof = json.professions.primary[1].name;
        break;
      }
    }
    done = prof_quests.filter(function(q){
      return json.quests.indexOf(q) >= 0;
    });
    $('table tbody tr[data-id="profession1"]')
    .append('<td class=' + (
      done == prof_quests.length ?
      'complete">Done' :
      'incomplete">' + done.length + '/' + prof_quests.length
    ) + '</td>');

    done = Data.balance_of_power.filter(function(q){
      return json.quests.indexOf(q) >= 0;
    });
    $('table tbody tr[data-id="bop"]')
    .append('<td class=' + (
      done == Data.balance_of_power.length ?
      'complete">Done' :
      'incomplete">' + done.length + '/' + Data.balance_of_power.length
    ) + '</td>');
  };

});
