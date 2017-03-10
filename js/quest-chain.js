define([], function(){
  'use strict';

  var QuestChain = function(ids, completed){
    this.ids = ids;
    this.completed = ids.filter(function(q){ return completed.indexOf(q) >= 0; });
    this.done = this.completed.length == this.ids.length;
    this.percent = Math.floor((this.completed.length / this.ids.length)*100);
    this.almost = (this.percent >= 70);
  };

  return QuestChain;
});
