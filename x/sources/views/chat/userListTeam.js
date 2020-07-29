/* global webix _ _api $$ moment */
import { JetView } from 'webix-jet'
export default class userListTeam extends JetView {
  config() {
    var context = this.app.getService('user').getUser()
    this.uid = '.' + context.user.toString()
    return {
      rows: [
        {
          rows: [
            {
              cols: [{
                view: 'text',
                id: 'teamName' + this.uid,
                placeholder: _('name'),
                required: true
              }, {
                view: 'button',
                tooltip: _('create'),
                icon: 'mdi mdi-check-circle',
                type: 'iconTop',
                css: 'toolbarButton',
                width: 40,
                height: 40,
                click: webix.bind(this.newTeam, this)
              }]
            },
            {
              view: 'dataview',
              id: 'team' + this.uid,
              height: 50,
              scroll: 'y',
              placeholder: _('members'),
              css: 'rowsTeam',
              type: {
                height: 50,
                width: 60
              },
              on: {
                onItemClick: webix.bind(this.removeUser, this)
              },
              template: function (obj) {
                return `<div style="position: relative;">
                <span title="${obj.name.replace(/(<([^>]+)>)/g, '')}">
                <img class="photo" style="float: left;width:44px;height:44px;" src="${_api}user.image?size=24&_id=${obj.id}">
                </span>
                </div>`
              }
            },
            {
              view: 'search',
              id: 'contactSearch' + this.uid,
              on: {
                onTimedKeyPress: webix.bind(this.contactSearch, this)
              }
            },
            {
              view: 'dataview',
              id: 'usersListTeam' + this.uid,
              css: 'webix_data_border',
              xCount: 1,
              type: {
                height: 'auto',
                width: 'auto'
              },
              relative: true,
              on: {
                onItemClick: webix.bind(this.addUser, this),
                onAfterRender: webix.once(webix.bind(this.loadUsers, this))
              },
              template: function (obj) {
                return `<div style="position: relative;">
                ${(obj.seen === '0' ? '<div class="badgeMsg"></div>' : '')}
                <span>
                <img class="${obj.online ? 'photoOnline' : 'photo'}" style="float: left;width:44px;height:44px;" src="${_api}user.image?size=24&_id=${obj.id}">
                <span style="font-weight: bold" >${obj.name}</span></br>
                <span style="">${obj.position && obj.position.length > 25 ? obj.position.substring(0, 25) + '...' : obj.position || ''}</span>
                </span>
                </div>`
              }
            }
          ]
        }
      ]
    }
  }

  removeUser(id) {
    $$('team' + this.uid).remove(id)
  }

  addUser(id) {
    const dv1 = $$('usersListTeam' + this.uid)
    const dv2 = $$('team' + this.uid)
    if (!dv2.exists(id)) {
      const record = dv1.getItem(id)
      dv2.add(record)
    }
  }

  newTeam() {
    const dv = $$('team' + this.uid)
    const name = $$('teamName' + this.uid).getValue()
    const ids = []
    if (name) {
      dv.find(function (obj) {
        ids.push(obj.id)
      })
      if (ids.length >= 2) {
        this.app.multiShow('chat.chat?newTeam=' + { team: ids, name: name }, name)
        // this.app.show('chat.chat?newTeam=' + {team: ids, name: name})
      } else {
        webix.message('Debe seleccionar 2 o más participantes')
      }
    } else {
      webix.message('Debe asignar un nombre al grupo')
    }
  }

  contactSearch() {
    var value = $$('contactSearch' + this.uid).getValue().toLowerCase()
    $$('usersListTeam' + this.uid).filter('#name#', value)
  }

  newChat(id) {
    var context = this.app.getService('user').getUser()
    const doc = webix.ajax().sync().post(_api + 'chat.findChat', { user1: id, user2: context.user.toString() })
    const chat = doc.responseText !== '' ? JSON.parse(doc.responseText) : false
    if (chat) {
      this.app.multiShow('chat.chat?_id=' + chat._id, chat._id)
      // this.app.show('chat.chat?_id=' + chat._id)
    } else {
      this.app.multiShow('chat.chat?user=' + id, id)
      // this.app.show('chat.chat?user=' + id)
    }
  }

  loadUsers() {
    var context = this.app.getService('user').getUser()
    this.app.socket.on('returnUsersConnected', webix.bind((data) => {
      if (data.users.length && $$('usersListTeam' + this.uid)) {
        $$('usersListTeam' + this.uid).show()
        $$('usersListTeam' + this.uid).clearAll()
        $$('usersListTeam' + this.uid).parse(data.users)
      }
    }, this))
    this.app.socket.emit('usersConnected', context.user.toString())
  }
}
