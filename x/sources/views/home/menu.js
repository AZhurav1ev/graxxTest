import { tags } from 'helpers/tags'

export const gpax = []
gpax.push(
  { id: tags.user, icon: 'mdi mdi-account-settings', value: _('users') },
  { id: 'chatsView', icon: 'mdi mdi-file-multiple', value: _('chats'), url: 'chat.chats' },
  { id: 'timeReportView', icon: 'mdi mdi-comment-multiple-outline', value: _('timeReport'), url: 'timeReport.timeReport' },
  { id: 'logout', icon: 'mdi mdi-power', value: _('logout'), url: 'logout' }
)

export const projects = gpax
