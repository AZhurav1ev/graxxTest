/* global webix */
/*
 * Datatable as field in a form
 */

webix.protoUI({
  name: 'dataviewBasic',
  setValue (value) {
    this.clearAll()
    if (value || value.length > 1) {
      this.parse(value)
    }
  },
  getValue () {
    return this.serialize()
  }
}, webix.ui.dataview)
