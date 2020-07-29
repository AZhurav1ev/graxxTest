import { JetView } from 'webix-jet'
export default class Homeview extends JetView {
  config () {
    var uid = webix.uid()
    this.validate = false
    webix.ui({
      view: 'window',
      id: 'windowExpired',
      position: 'center',
      head: '"' + _('expired Password') + '" ' + _('update'),
      width: 500,
      height: 300,
      modal: true,
      type: 'clean',
      margin: 0,
      body: {
        rows: [{
          view: 'form',
          id: 'f_Expired',
          relative: true,
          elements: [
            {
              view: 'text',
              type: 'password',
              id: 'password' + uid,
              name: 'password',
              labelWidth: 120,
              label: _('password'),
              required: true,
              validateEvent: 'blur',
              on: {
                onChange: webix.bind(function (newv) {
                  var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
                  var valid = newv.length === 0 || regex.test(newv)
                  if (!valid) {
                    webix.message(_('invalidPassword'), 'error', 3000)
                    this.validate = false
                  }
                  this.validate = true
                }, this)
              },
              validate: function (newv) {
                var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
                var valid = newv.length === 0 || regex.test(newv)
                return valid
              }
            },
            {
              view: 'text',
              type: 'password',
              id: 'repeatPassword' + uid,
              name: 'repeatPassword',
              labelWidth: 120,
              label: _('repeatPassword'),
              required: true,
              on: {
                onChange: webix.bind(function (newv) {
                  var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
                  var valid = newv.length === 0 || regex.test(newv)
                  if (!valid) {
                    webix.message(_('invalidPassword'), 'error', 3000)
                    this.validate = false
                  } else {
                    this.validate = true
                    var values = $$('f_Expired').getValues()
                    if (values.password !== values.repeatPassword) {
                      this.validate = false
                      webix.message(_('differentPassword'), 'error', 3000)
                    }
                  }
                }, this)
              },
              validate: function (newv) {
                var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
                var valid = newv.length === 0 || regex.test(newv)
                if (valid) {
                  if ($$('password' + uid).getValue() !== $$('repeatPassword' + uid).getValue()) {
                    return false
                  } else {
                    return true
                  }
                } else {
                  return valid
                }
              }
            },
            {
              cols: [
                { width: 125 },
                { view: 'button', value: _('update'), width: 200, click: webix.bind(this.update, this) },
                { width: 25 },
                { view: 'button', value: _('logout'), width: 75, click: webix.bind(this.login, this) }
              ]
            }
          ]
        }
        ]
      }
    }).hide()

    var ui = {
      rows: [
        //{ relative: true, $subview: 'home.header' },
        { relative: true, $subview: 'home.multiview' }
      ]
    }
    return ui
  }

  init () {
    // Window Global to show progress in diferents views
    webix.ui({
        view: "window",
        id: 'progressWindowGlobal',
        width: 260,
        height: 40,
        position: "center",
        head: false,
        modal: true,
        body: {
          id: 'templateWindowGlobal', template: '<label for="file">' + _('progress') + ': </label><progress max="100" value="0" id="ft-progGlobal"></progress>'
        }
      })
    const appTemp = this.app
    const canClose = this.app.canClose
    // Wait for device API libraries to load
        function onLoad() {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        // device APIs are available
        function onDeviceReady() {
            // Register the event listener
            document.addEventListener("backbutton",  webix.bind( () => {
              canClose()
          },this), false)
          window.open = cordova.InAppBrowser.open
          cordova.plugins.backgroundMode.enable()
          cordova.plugins.backgroundMode.setDefaults({ silent: true })
          cordova.plugins.notification.local.requestPermission(function (granted) { console.log('aceptado notificaciones') })
          cordova.plugins.notification.local.on("click", function (notification) {
              if (notification.data && notification.data.run && appTemp[notification.data.run]) {
                appTemp[notification.data.run](notification.data)
              }
          })
        }
        // Handle the back button
       
        onLoad()
    var context = this.app.getService('user').getUser()
    if (context.expiredPassword) { $$('windowExpired').show() }
  }

  login () {
    $$('windowExpired').hide()
    this.app.show('/login')
  }

  update () {
    var context = this.app.getService('user').getUser()
    var form = $$('f_Expired')
    var data = form.getValues()
    data._id = context.user
    var pass1 = data.password || ''
    var pass2 = data.repeatPassword || ''
    if (this.validate && pass1 && pass2) {
      webix.confirm({
        title: _('warning'),
        ok: _('yes'),
        cancel: _('no'),
        text: _('update'),
        callback: (result) => {
          if (result) {
            webix.ajax().post(_api + 'user.updateExpiredPassword', data, (txt, res, req) => {
              if (res && req.status === 200) {
                res = res.json()
                if (res.msj === 'ok') {
                  webix.message(_('savedChanges') + ', Ingresa con la nueva clave', 'info')
                  $$('windowExpired').hide()
                  this.app.show('/login')
                } else if (res.msj === 'not saved') {
                  webix.message('Error ' + req.status + ', please retry...', 'error')
                } else if (res.msj === 'iguales') {
                  webix.message(_('Ingrese una contraseña diferente a la anterior'), 'error')
                }
              } else {
                webix.message('Error ' + req.status + ', please retry...', 'error')
              }
            })
          }
        }
      })
    } else {
      webix.message(_('differentPassword') + ' or nulls', 'error')
    }
  }
}
