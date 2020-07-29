webix.protoUI({
  name: 'password',
  $init: function (config) {
    this._id = webix.uid()
    var item = config
    item.id = this._id
    item.view = 'text'
    item.type = 'password'
    item.relative = true
    config.cells = [
      item,
      {
        view: 'button',
        type: 'icon',
        icon: 'mdi mdi-eye',
        id: 'bt' + this._id,
        right: 0,
        bottom: 12,
        width: 30,
        height: 20,
        css: 'toolbarButton',
        click: (id) => {
          var pass = $$(this._id)
          var value = pass.getValue()
          pass.config.type = pass.config.type === 'password' ? 'text' : 'password'
          pass.refresh()
          pass.setValue(value)
          var eye = $$('bt' + this._id)
          eye.config.icon = eye.config.icon === 'mdi mdi-eye' ? 'mdi mdi-eye-off' : 'mdi mdi-eye'
          eye.refresh()
        }
      }
    ]
  },
  getValue() {
    var r = ''
    if ($$(this._id)) {
      r = $$(this._id).getValue()
    }
    return r
  },
  setValue(value) {
    if ($$(this._id)) {
      $$(this._id).setValue(value)
    }
  }
}, webix.ui.abslayout)
