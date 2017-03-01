define([], function(){
  'use strict';

  var QuestChain = function(ids, completed){
    this.ids = ids;
    this.completed = completed;
  };

  return QuestChain;
});
