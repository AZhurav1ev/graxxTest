/* global webix */
import { JetView } from 'webix-jet'
import * as menu from './menu'

export default class Sidebar extends JetView {
  config () {
    var context = this.app.getService('user').getUser()
    var uid = webix.uid()
    if (!context.licensedUser && context.menu !== 'clients') { context.menu = 'auditor' }
    return {
      rows: [
        //   { height: 34, css: 'gpax' },
        {
          view: 'menu',
          id: 'sidebar' + uid,
          tooltip: true,
          autowidth: true,
          layout: 'y',
          subMenuPos: 'right',
          width: 45,
          css: 'sidebar',
          template: '<img src=\'#image#\' class=\'menu_image\'/>',
          on: {
            onMenuItemClick: this.menuClick
          },
          data: this.menu(context)
        }
      ]
    }
  }
  menuClick (id) {
    var item = this.getMenuItem(id)
    if (item.url) {
      this.$scope.app.multiShow(item.url, id)
    }
  }

  menu (context) {
    var m = JSON.parse(JSON.stringify(menu[context.menu]))
    if (!context.createUsers) {
      this.deleteUser(m)
    }
    return m
  }

  deleteUser (m) {
    for (const i in m) {
      if (m[i].id === 'user' || m[i].id === 'reportUser') {
        m.splice(i, 1)
        return
      } else if (m[i].data) {
        this.deleteUser(m[i].data)
      }
    }
  }
}
