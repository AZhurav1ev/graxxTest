/* global _ */
import { JetView } from 'webix-jet'
import * as menu from './menu'

export default class Multiview extends JetView {
  config() {
    var context = this.app.getService('user').getUser()
    var initial = { id: 'timeReport', value: _('slopes'), url: 'timeReport.timeReport' }
    return {
      rows: [
        { relative: true, $subview: 'home.header' },
        {
          view: 'multiview',
          id: 'multiviewGlobal',
          cells: [
            {
              id: initial.id,
              rows: [
                { $subview: initial.url }
              ]
            }
          ]
        }
      ]
    }
  }

  ready() {
    webix.UIManager.addHotKey('esc', this.app.canClose)
  }

  added(id) {
    this.getRoot().setValue(id)
  }
}
