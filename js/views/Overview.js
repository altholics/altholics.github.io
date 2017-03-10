define(['jquery', 'lil-event', 'template7'], function($, lil, T7){
  'use strict';

  function Overview(){
    this.$el = $('#overview');
    $.get('tmpl/overview.html', function(data){
      this.tmpl = T7.compile(data);
      this.ready = true;
      this.emit('ready');
    }.bind(this));
  }

  Overview.prototype = Object.create(lil.Event.prototype);

  Overview.prototype.render = function(json){
    if (!this.ready){ this.once('ready', this.render.bind(this, json)); }
    else{ this.$el.html(this.tmpl(json)); }
  };

  return new Overview();
});
