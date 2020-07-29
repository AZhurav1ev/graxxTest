/* global webix _api _ $$ */
import 'helpers/selectone'
webix.protoUI({
  name: 'tag',
  $init: function (config) {
    this._tag = config.tag ? config.tag : 'tag'
    this._multicombo = webix.uid()
    this._dt = webix.uid()
    this._form = webix.uid()
    var multicombo = {
      view: config.multiple ? 'multicombo' : 'selectone',
      label: config.label,
      id: this._multicombo,
      labelPosition: 'top',
      readonly: config.readonly ? config.readonly : false,
      suggest: {
        body: {
          url: _api + 'params.options?name=' + this._tag,
          template: function (obj) {
            return "<span class='tag' style='background-color:" + obj.color + "'>" + obj.value + '</span>'
          }
        }
      }
    }
    if (config.newTags) {
      var popupId = webix.uid()
      var popup = {
        view: 'popup',
        id: popupId,
        width: window.innerWidth * 0.4,
        height: window.innerHeight * 0.4,
        body: {
          cols: [{
            view: 'abslayout',
            cols: [
              {
                view: 'datatable',
                relative: true,
                columns: [
                  { id: 'value', header: _('tag'), template: "<span class='tag' style='background-color:#color#'>#value#</span>", fillspace: 1 }
                ],
                select: true,
                id: this._dt,
                on: { onAfterLoad: webix.bind(this.showTag, this) },
                url: _api + 'params.options?name=' + this._tag
              },
              { view: 'button', type: 'icon', icon: 'mdi mdi-plus', tooltip: _('new'), width: 30, height: 35, right: 3, bottom: 7, css: 'formButton', click: webix.bind(this.add, this) }
            ]
          },
          {
            view: 'form',
            id: this._form,
            hidden: true,
            elements: [
              { view: 'text', name: 'value', label: this._tag, validate: 'isNotEmpty' },
              { view: 'colorpicker', name: 'color', label: _('color'), validate: 'isNotEmpty' },
              {
                cols: [{},
                  { view: 'button', type: 'iconTop', icon: 'mdi mdi-content-save', tooltip: _('save'), width: 30, css: 'formButton', click: webix.bind(this.save, this) },
                  { view: 'button', type: 'iconTop', icon: 'mdi mdi-eraser', tooltip: _('cancel'), width: 30, css: 'formButton', click: () => { $$(popupId).hide() } },
                  { view: 'button', type: 'iconTop', icon: 'mdi mdi-trash-can', tooltip: _('remove'), width: 30, css: 'formButton', click: webix.bind(this.delete, this) }
                ]
              }, {}
            ]
          }]
        }
      }
      var add = { view: 'button', type: 'icon', icon: 'mdi mdi-pencil-plus', css: 'formButton', tooltip: _('update') + this._tag, width: 20, height: 20, popup: popup }
      config.cols = [multicombo, add]
    } else {
      config.cols = [multicombo]
    }
  },
  refresh () {
    if (this.config.readonly) {
      var multicombo = $$(this._multicombo)
      multicombo.define('readonly', true)
      multicombo.refresh()
    }
  },
  showTag () {
    var dt = $$(this._dt)
    var form = $$(this._form)
    form.bind(dt)
    var firtsId = dt.getFirstId()
    if (firtsId) {
      form.show()
      dt.select(firtsId)
      form.focus('value')
    }
  },
  getValue () {
    var r = []
    if ($$(this._multicombo)) {
      r = $$(this._multicombo).getValue()
    }
    return r
  },
  setValue (value) {
    if (typeof value === 'object') { value = value.join(',') }
    if ($$(this._multicombo)) {
      $$(this._multicombo).setValue(value)
    }
  },
  add () {
    $$(this._form).show()
    var dt = $$(this._dt)
    this.row = dt.add({ value: '', color: '#000' })
    dt.select(this.row)
    dt.showItem(this.row)
    $$(this._form).focus('value')
  },
  save () {
    var form = $$(this._form)
    if (form.validate()) {
      var data = form.getValues()
      data.name = this._tag
      if (data.id) {
        webix.ajax().post(_api + 'params.save', data, (txt, res, req) => {
          if (req.status === 200) {
            var dt = $$(this._dt)
            var tag = res.json()
            if (data.id !== tag.id) {
              dt.load(_api + 'params.options?name=' + this._tag)
              dt.remove(this.row)
              $$(this._multicombo).getList().add(tag)
            } else {
              dt.updateItem(data.id, tag)
              $$(this._multicombo).getList().updateItem(data.id, tag)
            }
          } else {
            webix.message('Error ' + req.status + ', please retry...', 'error')
          }
        })
      } else {
        webix.message('Error, agregue un elemento', 'error')
      }
    }
  },
  delete () {
    var form = $$(this._form)
    var id = form.getValues().id
    webix.ajax().post(_api + 'params.delete', { name: this._tag, options: { id: id } }, (txt, res, req) => {
      if (req.status === 200) {
        $$(this._dt).remove(id)
        $$(this._multicombo).getList().remove(id)
        $$(this._dt).load(_api + 'params.options?name=' + this._tag)
      } else {
        webix.message('Error ' + req.status + ', please retry...', 'error')
      }
    })
  }
}, webix.ui.layout)
