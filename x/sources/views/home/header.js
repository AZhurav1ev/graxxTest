/* global $$ _ _api $$ webix */
import { JetView } from 'webix-jet'
import { tags } from 'helpers/tags'
import * as menu from './menu'

export default class Header extends JetView {
  config () {
    var context = this.app.getService('user').getUser()
    this.uid = '.' + webix.uid()
    webix.ui({
      view: 'sidemenu',
      id: 'menu',
      width: 200,
      position: 'left',
      state: function (state) {
        var toolbarHeight = $$('toolbar').$height
        state.top = toolbarHeight
        state.height -= toolbarHeight
      },
      body: {
        view: 'list',
        id: 'listMenu' + this.uid,
        type: {
          height: 'auto',
          width: 'auto'
        },
        borderless: true,
        scroll: false,
        template: function (obj) {
          if (obj.id === 'user') {
            return `<div style="position:relative">
            <div class="imgProfile bg-image bg-wrap text-center py-4" style="background-image: url(${_api + 'user.image?_id=' + context.user});"></div>
            <div class="user-logo">
                <img class="imgProfile" src="${_api + 'user.image?_id=' + context.user}">
                </div>
            <div class="name-logo">    
              <h3>${context.name}</h3>
            </div>      
            </div>`
          } else {
            return "<span class='webix_icon " + obj.icon + "'></span> " + obj.value
          }
        },
        onClick: {
          'user-logo': webix.bind(this.profile, this)
        },
        on: {
          onItemClick: webix.bind(this.menuClick, this)
        },
        data: this.menu(context)
      }
    })
    return {
      id: 'header',
      css: 'gpax',
      height: 50,
      type: 'clean',
      cols: [
        {
          cols: [
            {
              rows: [
                {
                  view: 'toolbar',
                  id: 'toolbar',
                  css: 'noSeparator',
                  elements: [
                    {
                      view: 'icon',
                      icon: 'mdi mdi-menu',
                      click: function () {
                        if ($$('menu').config.hidden) {
                          $$('menu').show()
                        } else { $$('menu').hide() }
                      }
                    },
                    { borderless: true, view: 'template', type: 'clean', template: '<img src="img/gpax.svg" style="max-width:100px">', css: 'gpax_label', tooltip: this.app.config.name + '@' + this.app.config.version },
                    { view: 'button', id: 'timeReport', type: 'iconTop', icon: 'mdi mdi-calendar-clock', width: 40, badge: '', value: '', tooltip: _('timeReport'), click: webix.bind(this.mvClick, this) },
                    { view: 'button', id: 'chats', type: 'iconTop', icon: 'mdi mdi-forum-outline', width: 40, badge: '', value: '', tooltip: _('chats'), click: webix.bind(this.mvClick, this) }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }

  profile () {
    var context = this.app.getService('user').getUser()
    $$('menu').hide()
    this.app.multiShow('user?_id=' + context.user, 'user')
  }

  menuClick (id) {
    const list = $$('listMenu' + this.uid)
    var item = list.getItem(id)
    if (item.url === 'logout') {
      $$('menu').hide()
      this.app.show(item.url)
    } else if (item.url) {
      $$('menu').hide()
      this.app.multiShow(item.url, id)
    }
  }

  menu (context) {
    var m = JSON.parse(JSON.stringify(menu[context.menu]))
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

  mvClick (id) {
    var menu = $$(id)
    if (id === 'timeReport') {
      menu.refresh()
      this.app.multiShow('timeReport.timeReport', 'timeReportView')
    } else if (id === 'chats') {
      menu.refresh()
      this.app.multiShow('chat.chats', 'chatsView')
    }
  }
}
