import { JetView } from 'webix-jet'
import 'helpers/froala'
import * as Froala from 'helpers/froala.config.js'
import 'helpers/tag'
import moment from 'moment'

export default class Dataview extends JetView {
  config() {
    this.uid = webix.uid()
    var context = this.app.getService('user').getUser()
    var id = context.activePlan.id
    var idReport = this.getParam('id', true)
    var date = this.getParam('date', true)
    var activity = this.getParam('activity', true)
    var time_id = this.getParam('time_id', true)
    return webix.ajax(_api + 'timeReport.get?id=' + idReport + '&scheduler=yes' + '&date=' + date + '&activity=' + activity + '&time_id=' + time_id).then(data => {
      var doc = data.json()
      var disabled = false
      var isNew = false
      this.uploaderFile = webix.ui({
        id: 'uploadFile' + this.uid,
        view: 'uploader',
        accept: 'text/plain, text/html, application/vnd.ms-excel, application/pdf, application/zip, application/x-7z-compressed, application/x-rar-compressed, video/x-msvideo, application/msword, application/vnd.oasis.opendocument.spreadsheet, application/vnd.oasis.opendocument.text, application/vnd.ms-powerpoint',
        name: 'uploader',
        apiOnly: true,
        on: {
          onAfterFileAdd: (file, response) => {
            this.app.file(file, response, $$('comment' + this.uid))
          }
        }
      })
      if (doc) {
        if (doc.activity) {
          doc.task = doc.activity
          doc.project = 'activity'
          if (doc.plan !== id || doc.action === 'lock') {
            disabled = true
          }
        } else if (doc.task) {
          var split = doc.task.split(',&,')
          doc.task = split[0]
          doc.project = split[1]
          doc.plan = split[2]
          if (split.length > 4) {
            doc.name = ''
            for (const i in split) {
              if (i >= 3) {
                if (i === split.length - 1) { doc.name = doc.name + split[i] } else { doc.name = doc.name + split[i] + ',&,' }
              }
            }
          } else { doc.name = split[3] }
          if (doc.statusProj !== 'processing' || doc.action === 'lock') {
            disabled = true
          }
        }
      } else {
        doc = {}
        isNew = true
      }

      return {
        view: 'abslayout',
        rows: [
          {
            view: 'form',
            relative: true,
            margin: 0,
            padding: 0,
            id: 'frreport' + this.uid,
            elements: [
              {
                view: 'combo',
                id: 'projects',
                on: {
                  onchange: (newv) => {
                    if (newv === 'activity') {
                      $$('activities' + this.uid).define('options', _api + 'params.activity?_id=' + id)
                      $$('activities' + this.uid).refresh()
                    } else {
                      $$('activities' + this.uid).define('options', _api + 'params.tasks?_id=' + newv)
                      $$('activities' + this.uid).refresh()
                    }
                  }
                },
                name: 'project',
                placeholder: _('project'),
                options: {
                  url: _api + 'params.options?name=projectList&activity=true',
                  filter: function (obj, filter) {
                    return obj.value.toLowerCase().indexOf(filter) != -1 || obj.value.indexOf(filter) != -1
                  }
                },
                validate: 'isNotEmpty'
              },
              {
                view: 'combo',
                id: 'activities' + this.uid,
                on: {
                  onchange: () => {
                    var id = $$('activities' + this.uid).getValue()
                    var list = $$('activities' + this.uid).getPopup().getList().serialize()
                    for (var i in list) {
                      if (list[i].id === id) {
                        $$('doc_id' + this.uid).setValue(list[i].idTask)
                      }
                    }
                  }
                },
                name: 'task',
                placeholder: _('task'),
                validate: 'isNotEmpty'
              },
              { view: 'text', id: 'doc_id' + this.uid, name: 'doc_id', hidden: true },
              { view: 'text', id: 'durationActivity', name: 'duration', placeholder: _('duration'), validate: webix.rules.isNumber },
              { view: 'froala', id: 'comment' + this.uid, config: Froala.moreBasic, name: 'comment', form: 'activities' + this.uid },
              {
                cols: [
                  {
                    view: 'button',
                    icon: 'mdi mdi-image',
                    type: 'iconTop',
                    css: 'toolbarButton',
                    width: 40,
                    click: () => { this.app.image($$('comment' + this.uid)) }
                  },
                  {
                    view: 'button',
                    icon: 'mdi mdi-paperclip',
                    type: 'iconTop',
                    css: 'toolbarButton',
                    width: 40,
                    click: webix.bind(this.file, this)
                  }, {},
                  {
                    view: 'button',
                    hidden: disabled,
                    icon: 'mdi mdi-content-save',
                    type: 'iconTop',
                    css: 'toolbarButton',
                    width: 40,
                    click: webix.bind(this.save, this)
                  }, {},
                  {
                    view: 'button',
                    hidden: disabled || isNew,
                    icon: 'mdi mdi-trash-can',
                    type: 'iconTop',
                    css: 'toolbarButton',
                    width: 40,
                    click: webix.bind(this.delete, this)
                  }
                ]
              }
            ],
            data: doc
          }
        ]
      }
    })
  }

  init() {
  }

  back() {
    this.app.canClose()
  }

  file() {
    if (this.uploaderFile) {
      this.uploaderFile.fileDialog()
    }
  }

  save() {
    var context = this.app.getService('user').getUser()
    var plan = context.activePlan.id
    var form = $$('frreport' + this.uid)
    var dat = form.getValues()
    var type
    if (dat._id) {
      if (dat.project === 'activity') {
        dat.type = 'activity'
        type = dat.type
        // delete dat.type
        dat.activity = dat.task
        delete dat.task
        delete dat.project
      } else {
        delete dat.doc_id
        dat.type = 'task'
        type = dat.type
        // delete dat.type
        dat.task = dat.task + ',&,' + dat.project + ',&,' + dat.plan + ',&,' + dat.name
      }
    } else {
      if (dat.project !== 'activity') {
        var date = this.getParam('date', true)
        const name = $$('activities' + this.uid).getText()
        dat.task = dat.task + ',&,' + dat.project + ',&,' + plan + ',&,' + name
        dat.date = moment(date)._d
        dat.type = 'task'
        type = dat.type
      } else {
        dat.type = 'activity'
        type = dat.type
        date = this.getParam('date', true)
        dat.activity = dat.task
        delete dat.task
        dat.date = moment(date)._d
        dat.date = { start: dat.date, end: dat.date }
        delete dat.project
      }
    }

    if (form.validate()) {
      webix.ajax().post(_api + 'timeReport.save?type=' + type, dat, (txt, res, req) => {
        if (req.status === 200) {
          var r = res.json()
          if (r.msj) {
            webix.message(r.msj, 'info')
          } else {
            webix.message(_('savedChanges'), 'info')
          }
          this.app.canClose()
        } else {
          webix.message('Error ' + req.status + ', please retry...', 'error')
        }
      })
    }
  }

  delete() {
    var form = $$('frreport' + this.uid)
    var id = form.getValues()._id
    webix.confirm({
      title: _('warning'),
      ok: _('yes'),
      cancel: _('no'),
      text: _('confirmDelete'),
      callback: (r) => {
        if (r) {
          webix.ajax(_api + 'timeReport.delete?_id=' + id).then(() => {
            webix.message(_('deleted'), 'info')
            this.app.canClose()
          })
        }
      }
    })
  }
}
