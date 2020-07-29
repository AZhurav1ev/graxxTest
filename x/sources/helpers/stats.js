/* global webix $$ */

webix.ui.datafilter.avgColumn = webix.extend({
  refresh: function (master, node, value) {
    var result = 0
    master.mapCells(null, value.columnId, null, 1, function (value) {
      value = value * 1
      if (!isNaN(value)) { result += value }
      return value
    })
    node.firstChild.innerHTML = Math.round(result / master.count())
  }
}, webix.ui.datafilter.summColumn)

webix.ui.datafilter.countColumn = webix.extend({
  refresh: function (master, node, value) {
    node.firstChild.innerHTML = '<span style="color:#00abcc;">' + master.count() + '</span>'
  }
}, webix.ui.datafilter.summColumn)

webix.ui.datafilter.ftsearch = webix.extend({
  refresh: function (master, node, value) {
    node.component = master.config.id
    webix.extend($$(node.component), webix.ProgressBar)
    $$(node.component).attachEvent('onAfterFilter', () => {
      $$(node.component).hideProgress()
    })
    master.registerFilter(node, value, this)
    if (value.value && this.getValue(node) !== value.value) this.setValue(node, value.value)
    node.onclick = webix.html.preventEvent
    webix.event(node, 'keydown', this.on_key_down)
  },
  on_key_down: function (e, node, value) {
    var id = this.component
    if ((e.which || e.keyCode) !== 13) return

    if (this.filter_timer) window.clearTimeout(this.filter_timer)
    this.filter_timer = webix.$$(id).filterByAll()
  }
}, webix.ui.datafilter.serverFilter)

webix.ui.datafilter.serverDateFilter = webix.extend({
  getValue: function () {
    var value = ''
    if (this._input) {
      value = this._input.getValue()
    }
    return value || ''
  },
  refresh: function (master, node, value) {
    node.component = master.config.id
    webix.extend($$(node.component), webix.ProgressBar)
    $$(node.component).attachEvent('onAfterFilter', () => {
      $$(node.component).hideProgress()
    })
    master.registerFilter(node, value, this)
    if (value.value && this.getValue(node) !== value.value) this.setValue(node, value.value)
    if (!this._input) {
      this._input = webix.ui({
        view: 'datepicker',
        container: 'datepicker' + this.uid,
        format: '%Y/%m/%d',
        stringResult: true,
        on: {
          onChange: webix.bind(this.filtrar, this)
        }
      })
    }
  },
  render: function (a, b) {
    this.uid = webix.uid()
    this.value=''
    return '<div id="datepicker' + this.uid + '"></div>'
  }
}, webix.ui.datafilter.serverFilter)
