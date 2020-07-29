/* global */
function status () {
  return webix.ajax().post(_api + 'user.status', {}).then(a => a.json())
}

function login (user,pass) {
  var r
  if (arguments.length === 2 && !arguments[1]) {
    r = webix.ajax().headers({authorization: 'CRT ' + user}).post(_api + 'user.connect', { }).then(a => a.json())
  } else if (arguments.length === 2) {
    r= webix.ajax().post(_api + 'user.spConnect', { user, pass }).then(a => a.json())
  }
  return r
}

function logout () {
  return webix.ajax().post(_api + 'user.disconnect', {}).then(a => a.json())
}
export default {
  status,
  login,
  logout
}
