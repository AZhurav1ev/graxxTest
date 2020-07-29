/* global webix */
webix.protoUI({
  name: 'selectone',
  setValue: function (value) {
    if (typeof value === 'string') {
      var r = value.split(',')
      r = r[r.length - 1]
      arguments[0] = r
      webix.ui.multicombo.prototype.setValue.apply(this, arguments)
    } else {
      arguments[0] = []
      webix.ui.multicombo.prototype.setValue.apply(this, arguments)
    }
  }
}, webix.ui.multicombo)
