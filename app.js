'use strict';

var api = (function(){
  var uri = 'https://us.api.battle.net/wow/';
  var key = 'ubph89vx2bks3yhk26rmhytyqndw2c3m';
  var locale = 'en_US';

  var api = function(){
    this.characters = [];
    this.update = this.update.bind(this);
  };

  function get(path, params, fn){
    $.isArray(path) && (path = path.join('/'));
    $.isArray(params) && (params = params.join('&'));
    params += '&locale=' + locale + '&apikey=' + key;
    $.get(uri + path + '?' + params, fn);
  }

  api.prototype.addCharacter = function(realm, name){
    console.log('adding character', realm, name);
    this.characters.push({realm: realm, name: name});
    get(['character', realm, name], ['fields=achievements,professions,progression,quests,reputation'], this.update);
  };

  api.prototype.update = function(json){
    window.json = json;
    console.log(json);
    this.characters.push(json);

    $('table thead tr').append('<th>'+json.name+'</th>');
    ['loremaster', 'azsuna', 'valshara', 'highmountain', 'stormheim', 'suramar', 'insurrection'].forEach(function(ach){
      $('table tbody tr[data-id="achiev.'+ach+'"]')
      .append('<td class="'+ (
        json.achievements.achievementsCompleted.indexOf(data.achievements[ach]) >= 0 ?
        'complete">Done' :
        'incomplete">In Progress'
      )+'</td>');
    });
    ['arccos', 'karazhan'].forEach(function(q){
      $('table tbody tr[data-id="unlock.'+q+'"]')
      .append('<td class="' + (
        json.quests.indexOf(data.quests[q]) >= 0 ?
        'complete">Done' :
        'incomplete">In Progress'
      )+'</td>');
    });

    var prof_quests;
    var prof;
    for (var p in data.professions){
      if (json.professions.primary[0].id == data.professions[p]){
        prof_quests = data.prof_quests[p];
        prof = json.professions.primary[0].name;
        break;
      }
      else if (json.professions.primary[1].id == data.professions[p]){
        prof_quests = data.prof_quests[p];
        prof = json.professions.primary[1].name;
        break;
      }
    }
    var done = prof_quests.every(function(q){
      return json.quests.indexOf(q) >= 0;
    });
    $('table tbody tr[data-id="profession"]')
    .append('<td class=' + (
      done ?
      'complete">Done' :
      'incomplete">In Progress'
    ) + '</td>')
  };

  return new api();
}());

$(function(){
  api.addCharacter('Ysera', 'Pelì');
});
