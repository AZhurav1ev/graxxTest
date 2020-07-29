import { JetView } from 'webix-jet'
import 'helpers/froala'
import 'helpers/tag'
import moment from 'moment'

export default class Dataview extends JetView {
  config () {
    moment.locale('es')
    this.uid = webix.uid()
    this._form = webix.uid()
    var date = this.getParam('date', true)
    date = moment(date)
    this.btn = ''

    return {
      on: {
        onViewShow: this.webix.bind(this.onViewShow, this)
      },
      rows: [{
        view: 'scrollview',
        id: 'verses',
        relative: true,
        body: {
          rows: [
            {
              view: 'form',
              margin: 0,
              padding: 0,
              id: '_form' + this.uid,
              elements: [
                {
                  view: 'label',
                  id: 'tmp' + this.uid,
                  height: 30,
                  label: '<strong><center>' + date.format('MMMM Do YYYY') + '</center></strong>'
                },
                {
                  view: 'dataview',
                  id: 'dt' + this.uid,
                  xCount: 1,
                  type: {
                    css: 'widthoutPadding',
                    height: 'auto',
                    width: 'auto'
                  },
                  on: {
                    onItemClick: webix.bind(this.clickItem, this),
                    onAfterLoad: () => {
                      if (this.btn !== '') {
                        this.btn.enable()
                      }
                    }
                  },
                  template: function (obj) {
                    return `<div class="dataview" >
                      <div style='float: right; width:40px;height:100%'><strong>${obj.totalV}h</strong></div>
                      <div>
                      <span class="title">${obj.nameProject ? _(obj.nameProject) : _('activity')} </span><br>
                      <span class="subtitle">${obj.activity} </span>
                      </div>
                      </div>`
                  }
                },
                {
                  cols: [
                    { view: 'template', id: 'totalHours' + this.uid, template: '', height: 40 },
                    {
                      view: 'button',
                      icon: 'mdi mdi-plus',
                      type: 'iconTop',
                      css: 'toolbarButton',
                      width: 40,
                      click: webix.bind(this.create, this)
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
      ]
    }
  }

  init () {
    var context = this.app.getService('user').getUser()
    var date = this.getParam('date', true)
    date = moment(date)
    var id = context.activePlan.id
    this.parseData(id, date)
  }

  onViewShow () {
    var context = this.app.getService('user').getUser()
    var date = this.getParam('date', true)
    date = moment(date)
    var id = context.activePlan.id
    this.parseData(id, date)
  }

  parseData (id, date) {
    webix.ajax(_api + 'timeReport.show?_id=' + id + '&date=' + date.format('YYYY-MM-DD'), (txt, json) => {
      const res = json.json()
      const data = []
      var tH = 0
      if (res) {
        const temp = res
        for (const i in temp) {
          if (temp[i].id !== 'footer') {
            if (temp[i].data) {
              for (const d in temp[i].data) {
                const row = temp[i].data[d]
                row.nameProject = temp[i].activity
                tH = tH + row.totalV
                data.push(row)
              }
            } else {
              tH = tH + temp[i].totalV
              data.push(temp[i])
            }
          }
        }
      }
      data.sort((a, b) => {
        var r = 0
        if (a.nameProject < b.nameProject) r = -1
        else if (a.nameProject > b.nameProject) r = 1
        else if (a.activity < b.activity) r = -1
        else if (a.activity > b.activity) r = 1
        return r
      })
      $$('dt' + this.uid).clearAll()
      $$('dt' + this.uid).parse(data)
      $$('totalHours' + this.uid).setHTML('<div>' + _('total') + " <span style='float: right;'><strong>" + tH + 'h</strong></span></div>')
    })
  }

  clickItem (id) {
    var context = this.app.getService('user').getUser()
    var idPlan = context.activePlan.id
    var row = $$('dt' + this.uid).getItem(id)
    var date = this.getParam('date', true)
    this.app.multiShow('timeReport.timeReportForm?id=' + row.id + '&scheduler=yes' + '&date=' + date + '&activity=' + row.activity + '&time_id=' + (row.document || row.id), row.id)
  }

  back () {
    this.app.canClose()
  }

  create () {
    var date = this.getParam('date', true)
    this.app.multiShow('timeReport.timeReportForm?date=' + date, 'new' + this.uid)
  }

  getWeekNumber (d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    return [d.getUTCFullYear(), weekNo, 1 - yearStart.getUTCDay()]
  }
}
