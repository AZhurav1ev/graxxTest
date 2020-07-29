/* global webix _ _api $$ moment */
import { JetView } from 'webix-jet'
export default class projectsList extends JetView {
  config() {
    var context = this.app.getService('user').getUser()
    this.uid = '.' + context.user.toString()
    return {
      rows: [
        {
          view: 'search',
          id: 'contactSearch' + this.uid,
          on: {
            onTimedKeyPress: webix.bind(this.contactSearch, this)
          }
        },
        {
          view: 'abslayout',
          id: 'abslProjectsList' + this.uid,
          cells: [
            {
              view: 'dataview',
              relative: true,
              id: 'projectsList' + this.uid,
              xCount: 1,
              type: {
                height: 'auto',
                width: 'auto'
              },
              on: {
                onItemDblClick: webix.bind(this.newTeamProject, this)
              },
              template: function (obj) {
                let display
                display = obj.manager && obj.manager.name ? obj.manager.name : ''
                display = display.replace(/(<([^>]+)>)/g, '')
                return `<div style="position: relative;"><span class="cornerSpan">P</span><div class="triangleCorner"></div>
                <span title="${display}">
                <img class='photo' style='width:44px;height:44px;' src="${_api}user.image?size=24&_id=${obj.manager.user}">
                <span style="font-weight: bold" >${obj.name}</span></br>
                <span style="background-color: orange; color: #fff; display: inline-block; padding-left: 7px; padding-right: 7px; font-weight: bold; font-size: 10px; border-radius: 5px;">${obj.startDate} - ${obj.endDate}</span>
                </span>
                </div>`
              },
              url: _api + 'project.list'
            }
          ]
        }
      ]
    }
  }

  contactSearch() {
    var value = $$('contactSearch' + this.uid).getValue().toLowerCase()
    $$('projectsList' + this.uid).filter('#name#', value)
  }

  newTeamProject(id) {
    this.app.multiShow('chat.chat?newTeamProject=' + { project: id }, id)
  }
}
