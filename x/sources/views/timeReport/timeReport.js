import { JetView } from 'webix-jet'
import 'helpers/froala'
import 'helpers/tag'
import moment from 'moment'
import { template } from 'models/templateNameView'

export default class Dataview extends JetView {
  config() {
    this.uid = webix.uid()
    var context = this.app.getService('user').getUser()

    var name = context.activePlan.name ? context.activePlan.name : ''
    this._form = webix.uid()
    this._formActivities = webix.uid()
    var result = this.getWeekNumber(new Date())

    var primer = new Date(result[0], 0, (result[1] - 1) * 7 + 1 + result[2])
    var ultimo = new Date(result[0], 0, (result[1] - 1) * 7 + 7 + result[2])
    this.meses = [_('january'), _('february'), _('march'), _('april'), _('may'), _('june'), _('july'), _('august'), _('september'), _('october'), _('november'), _('december')]
    var Month = primer.getMonth()
    var from = primer.getDate()
    var to = ultimo.getDate()
    this.btn = ''

    return {
      on: {
        onViewShow: this.webix.bind(this.onViewShow, this)
      },
      rows: [
        template(_('timeReport')),
        {
          view: 'scrollview',
          id: 'verses',
          relative: true,
          body: {
            rows: [{
              margin: 0,
              padding: 0,
              view: 'form',
              id: '_form' + this.uid,
              elements: [
                {
                  cols: [
                    { view: 'button', id: 'back' + this.uid, type: 'iconTop', css: 'toolbarButton', icon: 'mdi mdi-chevron-left-circle', tooltip: _('previousWeek'), width: 30, height: 30, click: webix.bind(this.recalculate, this) },
                    {
                      view: 'label',
                      id: 'tmp' + this.uid,
                      height: 30,
                      label: '<strong><center>' + this.meses[Month] + ' ' + from + ' - ' + to + ', ' + result[0] + '</center></strong>'
                    },
                    { view: 'button', id: 'next' + this.uid, type: 'iconTop', css: 'toolbarButton', icon: 'mdi mdi-chevron-right-circle', tooltip: _('nextWeek'), width: 30, click: webix.bind(this.recalculate, this) }
                  ]
                },
                { view: 'text', id: 'year' + this.uid, value: result[0], hidden: true },
                { view: 'text', id: 'week' + this.uid, value: result[1], hidden: true },
                { view: 'text', id: 'adjust' + this.uid, value: result[2], hidden: true },
                {
                  view: 'dataview',
                  id: 'dt' + this.uid,
                  xCount: 1,
                  type: {
                    css: 'withoutPadding',
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
                    return '<div>' + _(obj.name) + " <span style='float: right;'><strong>" + obj.hours + 'h</strong></span></div>'
                  }
                },
                { view: 'template', id: 'totalHours' + this.uid, template: '', height: 40 }
              ]
            }
            ]
          }
        }
      ]
    }
  }

  init() {
    var result = this.getWeekNumber(new Date())
    var primer = new Date(result[0], 0, (result[1] - 1) * 7 + 1 + result[2])
    var ultimo = new Date(result[0], 0, (result[1] - 1) * 7 + 7 + result[2])
    var context = this.app.getService('user').getUser()
    var id = context.activePlan.id
    this.parseData(id, primer, ultimo)
  }

  onViewShow() {
    var context = this.app.getService('user').getUser()
    var id = context.activePlan.id
    var txtWeek = $$('week' + this.uid)
    var week = parseInt(txtWeek.getValue())
    var txtYear = $$('year' + this.uid)
    var year = txtYear.getValue()
    var adjust = $$('adjust' + this.uid)
    adjust = parseInt(adjust.getValue())
    var primer = new Date(year, 0, (week - 1) * 7 + 1 + adjust)
    var ultimo = new Date(year, 0, (week - 1) * 7 + 7 + adjust)
    $$('dt' + this.uid).clearAll()
    this.parseData(id, primer, ultimo)
  }

  parseData(id, primer, ultimo) {
    webix.ajax(_api + 'timeReport.show?_id=' + id + '&primer=' + primer + '&ultimo=' + ultimo, (txt, json) => {
      const res = json.json()
      const data = [
        { name: 'monday', hours: 0, date: primer },
        { name: 'tuesday', hours: 0, date: moment(primer).add(1, 'days')._d },
        { name: 'wednesday', hours: 0, date: moment(primer).add(2, 'days')._d },
        { name: 'thursday', hours: 0, date: moment(primer).add(3, 'days')._d },
        { name: 'friday', hours: 0, date: moment(primer).add(4, 'days')._d },
        { name: 'saturday', hours: 0, date: moment(primer).add(5, 'days')._d },
        { name: 'sunday', hours: 0, date: ultimo }
      ]
      var tH = 0
      if (res) {
        const temp = res
        for (const i in temp) {
          if (temp[i].id !== 'footer') {
            if (temp[i].L) {
              data[0].hours = data[0].hours + temp[i].L
              tH = tH + temp[i].L
            }
            if (temp[i].M) {
              data[1].hours = data[1].hours + temp[i].M
              tH = tH + temp[i].M
            }
            if (temp[i].MC) {
              data[2].hours = data[2].hours + temp[i].MC
              tH = tH + temp[i].MC
            }
            if (temp[i].J) {
              data[3].hours = data[3].hours + temp[i].J
              tH = tH + temp[i].J
            }
            if (temp[i].V) {
              data[4].hours = data[4].hours + temp[i].V
              tH = tH + temp[i].V
            }
            if (temp[i].S) {
              data[5].hours = data[5].hours + temp[i].S
              tH = tH + temp[i].S
            }
            if (temp[i].D) {
              data[6].hours = data[6].hours + temp[i].D
              tH = tH + temp[i].D
            }
          }
        }
      }
      $$('dt' + this.uid).parse(data)
      $$('totalHours' + this.uid).setHTML('<div>' + _('total') + " <span style='float: right;'><strong>" + tH + 'h</strong></span></div>')
    })
  }

  clickItem(id) {
    const item = $$('dt' + this.uid).getItem(id)
    var context = this.app.getService('user').getUser()
    var plan = context.activePlan.id
    if (item.hours > 0) {
      this.app.multiShow('timeReport.timeReportForDay?id=' + plan + '&date=' + moment(item.date).format('YYYY-MM-DD'), this.uid)
    } else {
      this.app.multiShow('timeReport.timeReportForm?date=' + moment(item.date).format('YYYY-MM-DD'), 'new' + this.uid)
    }
  }

  getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    return [d.getUTCFullYear(), weekNo, 1 - yearStart.getUTCDay()]
  }

  recalculate(btn) {
    this.btn = $$(btn)
    this.btn.disable()
    var context = this.app.getService('user').getUser()
    var id = context.activePlan.id
    var txtWeek = $$('week' + this.uid)
    var week = parseInt(txtWeek.getValue())
    var txtYear = $$('year' + this.uid)
    var year = txtYear.getValue()

    if (btn === 'next' + this.uid) {
      var newWeek = week + 1
    }
    if (btn === 'back' + this.uid) {
      newWeek = week - 1
    }
    txtWeek.setValue(newWeek)
    var adjust = $$('adjust' + this.uid)
    adjust = parseInt(adjust.getValue())
    var primer = new Date(year, 0, (newWeek - 1) * 7 + 1 + adjust)
    var ultimo = new Date(year, 0, (newWeek - 1) * 7 + 7 + adjust)
    var YY = primer.getFullYear()
    var Month = primer.getMonth()
    var from = primer.getDate()
    var to = ultimo.getDate()
    $$('tmp' + this.uid).setHTML('<center>' + this.meses[Month] + ' ' + from + ' - ' + to + ', ' + YY + '</center>')
    $$('dt' + this.uid).clearAll()
    this.parseData(id, primer, ultimo)
  }
}
