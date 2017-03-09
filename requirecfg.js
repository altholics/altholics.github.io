/* globals requirejs */
requirejs.config({
  baseUrl: 'js',
  paths: {
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min",
    "lil-event": "https://cdn.rawgit.com/lil-js/event/0.1.3/event",
    "template7": "../bower_components/Template7/dist/template7.min"
  },
  shim: {
    'template7': {
      exports: 'Template7'
    }
  }
});

requirejs(["app"], function(App){ window.app = new App(); });
