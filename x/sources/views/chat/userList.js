/* global  */
import { JetView } from 'webix-jet'
export default class userList extends JetView {
  config() {
    var context = this.app.getService('user').getUser()
    this.uid = '.' + context.user.toString()
    return {
      rows: [
        {
          view: 'search', id: 'contactSearch' + this.uid,
          on: {
            onTimedKeyPress: webix.bind(this.contactSearch, this)
          }
        },
        {
          view: 'abslayout',
          id: 'abslUsersList' + this.uid,
          cells: [
            {
              view: 'dataview',
              id: 'usersList' + this.uid,
              css: 'webix_data_border',
              xCount: 1,
              type: {
                height: 'auto',
                width: 'auto'
              },
              relative: true,
              on: {
                'onItemClick': webix.bind(this.newChat, this),
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

  contactSearch() {
    var value = $$('contactSearch' + this.uid).getValue().toLowerCase()
    $$('usersList' + this.uid).filter('#name#', value)
  }

  newChat(id) {
    var context = this.app.getService('user').getUser()
    let doc = webix.ajax().sync().post(_api + 'chat.findChat', { user1: id, user2: context.user.toString() })
    let chat = doc.responseText !== '' ? JSON.parse(doc.responseText) : false
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
      if (data.users.length && $$('usersList' + this.uid)) {
        $$('usersList' + this.uid).show()
        $$('usersList' + this.uid).clearAll()
        $$('usersList' + this.uid).parse(data.users)
      }
    }, this))
    this.app.socket.emit('usersConnected', context.user.toString())
  }
}
