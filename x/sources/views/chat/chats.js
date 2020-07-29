/* global moment  */
import { JetView } from 'webix-jet'
import 'helpers/dataviewBasic'
import { template } from 'models/templateNameView'
export default class Chats extends JetView {
  config() {
    moment.locale('es')
    var context = this.app.getService('user').getUser()
    this.uid = '.' + context.user.toString()

    return {
      rows: [
        template(_('chats')),
        {
          view: 'search',
          id: 'contactSearch' + this.uid,
          on: {
            onTimedKeyPress: webix.bind(this.contactSearch, this)
          }
        },
        {
          rows: [
            {
              view: 'dataview',
              id: 'chats' + this.uid,
              css: 'webix_data_border',
              xCount: 1,
              type: {
                height: 'auto',
                width: 'auto'
              },
              relative: true,
              on: {
                onItemClick: webix.bind(this.openChat, this),
                onAfterLoad: webix.bind(this.refreshUserConnected, this),
                onDestruct: () => {
                  clearInterval(this.idSetTimeOutUsersOnline)
                }
              },
              template: (obj) => {
                if (obj.team) {
                  return `<div style="position: relative;">
                          ${(obj.seen === '0' ? '<div class="badgeMsg"></div>' : '')}
                          <div style="float: right">${moment(obj.date).startOf('second').fromNow()}</div>
                          <span>
                          <div class="avatar small">
                          <span>${this.createNameAvatarTeam(obj.username)}</span>
                          </div>
                          <span style="font-weight: bold" >${obj.username}</span></br>
                          <span style="font-weight:${(obj.seen === '0' ? 'bold' : 'normal')}">${obj.lastMsg.length > 25 ? obj.lastMsg.substring(0, 25) + '...' : obj.lastMsg}</span>
                          </span>
                          </div>`
                } else {
                  return `<div style="position: relative;">
                          ${(obj.seen === '0' ? '<div class="badgeMsg"></div>' : '')}
                          <div style="float: right">${moment(obj.date).startOf('second').fromNow()}</div>
                          <span>
                          <img class="${obj.online ? 'photoOnline' : 'photo'}" style="float: left;width:44px;height:44px;" src="${_api}user.image?size=24&_id=${obj.user}">
                          <span style="font-weight: bold" >${obj.username}</span></br>
                          <span style="font-weight:${(obj.seen === '0' ? 'bold' : 'normal')}">${obj.lastMsg.length > 25 ? obj.lastMsg.substring(0, 25) + '...' : obj.lastMsg}</span>
                          </span>
                          </div>`
                }
              },
              url: _api + 'chat.list?'
            },
            {
              relative: true,
              height: 55,
              cols: [
                {
                  view: 'button',
                  label: _('newChat'),
                  icon: 'mdi mdi-message-text',
                  type: 'iconTop',
                  css: 'toolbarButton',
                  click: webix.bind(this.showUsers, this)
                },
                {
                  view: 'button',
                  label: _('newTeam'),
                  icon: 'mdi mdi-account-multiple-plus',
                  type: 'iconTop',
                  css: 'toolbarButton',
                  click: webix.bind(this.showUsersTeam, this)
                },
                {
                  view: 'button',
                  label: _('teamProject'),
                  icon: 'mdi mdi-folder-multiple-outline',
                  type: 'iconTop',
                  css: 'toolbarButton',
                  click: webix.bind(this.showProjects, this)
                }
              ]
            }
          ]
        }
      ]
    }
  }

  init() {
    this.app.socket.on('received', webix.bind((data) => {
      var context = this.app.getService('user').getUser()
      const id = '.' + context.user.toString()
      if ($$('chats' + id).isVisible()) {
        if (data.isNew) {
          $$('chats' + id).clearAll()
          $$('chats' + id).load($$('chats' + id).config.url)
        } else {
          $$('chats' + id).load($$('chats' + id).config.url).finally(() => {
            $$('chats' + id).sort('#lastDate#', 'desc')
          })
        }
      }
    }, this))
  }

  contactSearch() {
    var value = $$('contactSearch' + this.uid).getValue().toLowerCase()
    if ($$('usersList' + this.uid)) {
      $$('usersList' + this.uid).filter('#name#', value)
    }
    if ($$('chats' + this.uid)) {
      $$('chats' + this.uid).filter('#username#', value)
    }
    if ($$('usersListTeam' + this.uid)) {
      $$('usersListTeam' + this.uid).filter('#username#', value)
    }
  }

  refreshUserConnected() {
    this.idSetTimeOutUsersOnline && clearInterval(this.idSetTimeOutUsersOnline)
    this.app.socket.on('returnRefreshUserConnected', webix.bind((data) => {
      if (data.users.length) {
        if ($$('chats' + this.uid)) {
          // for (let u in data.users) {
          $$('chats' + this.uid).find((obj) => {
            if (data.users.includes(obj.user.toString())) {
              obj.online = true
              $$('chats' + this.uid).updateItem(obj.id, obj)
            } else {
              delete obj.online
              $$('chats' + this.uid).updateItem(obj.id, obj)
            }
          }, true)
          // }
        }
      }
    }, this))
    this.app.socket.emit('refreshUserConnected')
    // refrescar usuarios conectados vista chats
    this.idSetTimeOutUsersOnline = setInterval(() => { this.app.socket.emit('refreshUserConnected') }, 60000)
  }

  createNameAvatarTeam(name) {
    return name
      .split(' ')
      .map(item => item.charAt(0))
      .slice(0, 2)
      .join('')
  }

  showUsers() {
    // this.app.show('chat.userList')
    this.app.multiShow('chat.userList', 'chat.userList')
  }

  showUsersTeam() {
    // this.app.show('chat.userListTeam')
    this.app.multiShow('chat.userListTeam', 'chat.userListTeam')
  }

  showProjects(s, e) {
    this.app.multiShow('chat.projectsList', 'chat.projectsList')
    // this.app.show('chat.projectsList')
  }

  openChat(id) {
    const item = $$('chats' + this.uid).getItem(id)
    item.seen = '1'
    $$('chats' + this.uid).updateItem(id, item)
    // this.app.show('chat.chat?_id=' + id)
    this.app.multiShow('chat.chat?_id=' + id, id)
  }
}
