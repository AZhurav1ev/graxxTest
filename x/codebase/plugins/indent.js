(function($R) {
  $R.add('plugin', 'indent', {
    translations: {
      en: {
        "indent": "Indent"
      },
      es: {
        "indent": "Indentar"
      }
    },
    init: function(app) {
      this.app = app;
      this.lang = app.lang;
      this.toolbar = app.toolbar;
    },
    start: function() {
      // create the button data
      var buttonData = {
        title: this.lang.get('indent'),
        api: 'plugin.indent.tab'
      };

      // create the button
      this.toolbar.addButton('sangria', buttonData);
    },
    tab: function() {
      this.app.insertion.insertRaw('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  });
})(Redactor);
