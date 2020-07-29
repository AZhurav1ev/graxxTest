/* global io Push APPNAME VERSION PRODUCTION */
import './styles/x.css'
import { JetApp, plugins, EmptyRouter, HashRouter } from 'webix-jet'
import session from 'models/session'
const Entities = require('html-entities').AllHtmlEntities

const entities = new Entities()

webix.ready(() => {
  var app = new JetApp({
    id: APPNAME,
    name: APPNAME,
    version: VERSION,
    debug: !PRODUCTION,
    start: '/home.home',
    router: PRODUCTION ? EmptyRouter : HashRouter
  })
  webix.ui.fullScreen()
  app.uid = webix.uid()
  webix.storage.cookie.put('sso', webix.storage.local.get('sso') || false)
  document.title = APPNAME.toUpperCase() + ' ' + VERSION
  // add click event in tag <a>
  document.addEventListener("click", function (e) {
    e.preventDefault()
    if (!e.toElement.offsetParent || (e.toElement.offsetParent && !e.toElement.offsetParent.id.includes('fredit'))) {
      if (e.toElement.tagName === 'A') {
        if (e.toElement.href.includes('file.get?_id=')) {
          app.getFile(e)
        } else if (e.toElement.href.includes('?_id=')) {
          let path
          for (let a in e.toElement.attributes) {
            if (e.toElement.attributes[a].name === 'href') {
              path = e.toElement.attributes[a].value
            }
          }
          let y = path
          let i = y.indexOf('=')
          let fileId = y.substring(i + 1)
          app.multiShow(path, fileId)
        } else {
          window.open(e.toElement.href, '_self')
        }
      } else if (e.toElement.tagName === 'IMG' && e.toElement.src.includes('file.get?_id=')) {
        app.getFile(e)
      }
    }

  })
  app.getFile = (e, toElement) => {
    var type
    if (toElement) {
      e = {
        toElement: toElement
      }
    }
    if (e.toElement.href) {
      type = e.toElement.href.split('&type=')
    } else {
      type = e.toElement.src.split('&type=')
    }
    if (type.length === 2) {
      type = type[1].toLowerCase()
    } else {
      type = ''
    }
    let y = e.toElement.href || e.toElement.src
    let i = y.indexOf('=')
    let f = y.indexOf('&')
    let fileId = y.substring(i + 1, f)
    var storageLocation = "";
    // storageLocation = 'file:///storage/emulated/0/';
    switch (device.platform) {
      case "Android":
        storageLocation = 'file:///storage/emulated/0/';
        break;
      case "iOS":
        storageLocation = cordova.file.documentsDirectory;
        break;
    }
    storageLocation = storageLocation + "Download/"
    if (e.toElement && e.toElement.tagName === 'IMG') {
      window.resolveLocalFileSystemURL(storageLocation + fileId + '.png', function (fileEntry) {
        cordova.plugins.fileOpener2.open(storageLocation + fileId + '.png')
      }, function () {
        DownloadToDevice(e.toElement.src, 'IMG', fileId)
      });
    } else if (e.toElement && e.toElement.tagName === 'A') {
      let ext = e.toElement.text.split('.')[e.toElement.text.split('.').length - 1]
      let name
      if (ext) {
        type = ext
        name = e.toElement.text.replace('.' + ext, fileId)
      } else {
        name = e.toElement.text
      }
      window.resolveLocalFileSystemURL(storageLocation + name + '.' + type, function (fileEntry) {
        cordova.plugins.fileOpener2.open(storageLocation + name + '.' + type)
      }, function () {
        DownloadToDevice(e.toElement.href, 'A', fileId, name + '.' + type)
      });
    }
    function DownloadToDevice(fileurl, type, fileId, name) {
      var progressWindow = $$('progressWindowGlobal')
      $$('templateWindowGlobal').setHTML('<label for="file">' + _('progress') + ': </label><progress max="100" value="0" id="ft-progGlobal"></progress>')
      progressWindow.show()
      var xhr = webix.ajax().getXHR()
      fileurl = fileurl + '&froala=1'
      xhr.open('GET', fileurl, true)
      xhr.responseType = 'blob'
      var blob = null
      /*var xhr = new XMLHttpRequest()
      xhr.open("GET", fileurl)
      xhr.responseType = "blob"//force the HTTP response, response-type header to be blob */
      xhr.onprogress = function (e) {
        let disSize
        let position = e.loaded
        if (position => 1000000) {
          disSize = (parseFloat(position) / 1000000).toFixed(2) + ' MB';
        }
        else if (position => 1000 && postion < 1000000) {
          disSize = (parseFloat(position) / 1000).toFixed(2) + ' KB';
        }
        $$('templateWindowGlobal').setHTML(position + ' | ' + disSize)

      }
      xhr.onload = function (r) {
        var filename = r.target.getResponseHeader('file-name')
        if (filename && filename.includes('/')) {
          filename = filename.split('/')
          filename = filename[filename.length - 1]
        }
        filename = type === 'A' ? name : fileId + '.png'
        blob = r.target.response
        // blob = xhr.response;//xhr.response is now a blob object
        var folderpath = storageLocation
        var DataBlob = blob
        $$('templateWindowGlobal').setHTML('<label for="file">' + _('progress') + ': </label><progress max="100" value="0" id="ft-progGlobal"></progress>')
        progressWindow.hide()
        window.resolveLocalFileSystemURL(folderpath, function (dir) {
          dir.getFile(filename, { create: true }, function (file) {
            file.createWriter(function (fileWriter) {
              //Download was succesfull
              fileWriter.onwrite = function (evt) {
                console.log("write success");
                window.galleryRefresh.refresh(
                  folderpath,
                  function (success) {
                    cordova.plugins.fileOpener2.open(folderpath + filename)
                  },
                  function (error) { console.log(error); }
                );
              };
              fileWriter.write(DataBlob)
            }, function (err) {
              // failed
              console.log(err)
            })
          });
        });
      }
      xhr.send()
    }
  }
  // ////////////////////////////////

  // add file or image from device///
  app.image = (froala, next) => {
    var options = {}
    var onConfirm = (buttonIndex) => {
      if (buttonIndex === 1) {
        options = {
          // Some common settings are 20, 50, and 100
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          // In this app, dynamically set the picture source, Camera or photo gallery
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true  //Corrects Android orientation quirks
        }
      } else if (buttonIndex === 2) {
        options = {
          // Some common settings are 20, 50, and 100
          quality: 50,
          destinationType: Camera.DestinationType.FILE_URI,
          // In this app, dynamically set the picture source, Camera or photo gallery
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true  //Corrects Android orientation quirks
        }
      }
      if (buttonIndex) {
        navigator.camera.getPicture(function (imageURI) {
          sendImage(imageURI, froala, next)
        }, onFail, options)
      }
    }
    navigator.notification.confirm(
      '', // message
      onConfirm,            // callback to invoke with index of button pressed
      _('Insert') + '...',           // title
      ['Hacer foto', 'Desde galería']     // buttonLabels
    )

    function sendImage(imageURI, froala, next) {
      var ft = new FileTransfer()
      var path = imageURI
      var progressWindow = $$('progressWindowGlobal')
      progressWindow.show()
      let bar = document.getElementById("ft-progGlobal")
      var name = new Date().toISOString() + '.JPEG'
      ft.onprogress = function (progressEvent) {
        if (progressEvent.lengthComputable) {
          var percentage = (progressEvent.loaded / progressEvent.total) * 100
          bar.value = percentage
        }
      }
      ft.upload(path,
        encodeURI(_api + 'chat.file'),
        webix.bind((result) => {
          let file = JSON.parse(result.response)
          bar.value = 0
          progressWindow.hide()
          if (file.id) {
            if (froala) {
              let content = froala.getValue()
              content = content + '<p style="text-align: left;"><img src="/api/file.get?_id=' + file.id + '&type=png" style="max-width: 100%; max-height: 100%;" class="fr-fic fr-dib fr-fil"></p>'
              froala.setValue(content)
            } else if (next) {
              next('<p style="text-align: left;"><img src="/api/file.get?_id=' + file.id + '&type=png" style="max-width: 100%; max-height: 100%;" class="fr-fic fr-dib fr-fil"></p>')
            }
          }
        }, this),
        function (error) {
          navigator.notification.alert('Error uploading file ' + path + ': ' + error.code)
        },
        { fileName: name })
    }

    function onFail(message) {
      if (message !== 'No Image Selected') {
        alert('Failed because: ' + message)
      }
    }
  }


  app.file = (file, response, froala, next) => {
    var progressWindow = $$('progressWindowGlobal')
    progressWindow.show()
    let bar = document.getElementById("ft-progGlobal")
    var formData = new FormData()
    formData.append("uploadfile", file.file, new Date().toISOString() + '.' + file.name)
    var xhr = new XMLHttpRequest();
    xhr.open('post', _api + 'chat.file', true);
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100
        bar.value = percentage
      }
    };
    xhr.onerror = function (e) {
      alert('An error occurred while submitting the form. Maybe your file is too big');
    };
    xhr.onload = () => {
      let doc = JSON.parse(xhr.responseText)
      bar.value = 0
      progressWindow.hide()
      if (doc.id) {
        if (froala) {
          let content = froala.getValue()
          content = content + '<p style="text-align: left;"><a class="fr-file" href="/api/file.get?_id=' + doc.id + '&type=txt" class="fr-fic fr-dib fr-fil">' + file.name + '</a></p>'
          froala.setValue(content)
        } else if (next) {
          next('<p style="text-align: left;"><a class="fr-file" href="/api/file.get?_id=' + doc.id + '&type=txt" class="fr-fic fr-dib fr-fil">' + file.name + '</a></p>')
        }
      }
    }
    xhr.send(formData)
  }

  // //////////////////////////////////
  app.setLanguage = function (language) {
    var lang = language.split('-')[0]
    app.use(plugins.Locale, { lang: lang })
    // eslint-disable-next-line no-global-assign
    _ = app.getService('locale')._
    webix.i18n.setLocale(language)
    if (webix.storage.local.get('lang') !== language) {
      webix.ajax(_api + 'user.setLang?lang=' + language)
      webix.storage.local.put('lang', language)
    }
  }
  app.canClose = function (id) {
    var mv = $$('multiviewGlobal')
    if (mv.getChildViews().length !== 1) {
      if (!id) id = mv.getValue()
      if ($$(id)) {
        var view = $$(id).$scope
        if (view._derty) {
          webix.confirm(_('confirm'), (result) => {
            if (result) {
              app.previousTab(id)
            }
          })
          return false
        }
        app.previousTab(id)
        return true
      }
      app.previousTab(id)
    } else {
      cordova.plugins.backgroundMode.moveToBackground()
    }
    return false
  }
  app.previousTab = function (id) {
    var pos = app.tabPrecedence.indexOf(id)
    if (app.tabPrecedence.length > 1) {
      app.tabPrecedence.splice(pos, 1)
      var mv = $$('multiviewGlobal')
      mv.removeView(id)
      if (app.tabPrecedence.length) {
        id = app.tabPrecedence[app.tabPrecedence.length - 1]
        if (!$$(id).isVisible()) {
          $$(id).show()
        }
      }
    }
  }
  app.selectView = function (id) {
    var pos = app.tabPrecedence.indexOf(id)
    if (pos !== -1) {
      app.tabPrecedence.splice(pos, 1)
    }
    app.tabPrecedence.push(id)
  }
  app.setLanguage(webix.storage.local.get('lang') || 'es-ES')
  app.settings = webix.storage.local.get('settings') || {}
  app.use(plugins.User, { model: session, ping: 60000 })
  app.render()
  app.tabPrecedence = ['slopes']
  app.multiShow = function (url, id) {
    var mv = $$('multiviewGlobal')
    if (mv) {
      app.selectView(id)
      if ($$(id) && mv.index($$(id)) !== -1) {
        mv.setValue(id)
      } else {
        mv.addView({
          id: id,
          rows: [
            { $subview: url }
          ]
        })
        mv.setValue(id)
        webix.UIManager.setFocus($$(id))
      }
    } else {
      app.show(url)
    }
  }
  app.invokeBp = function (data, next) {
    webix.ajax().post(_api + 'engine.invoke', data).then((res) => {
      var reply = res.json()
      if (reply.gui) {
        app.tabShow('user.service?bpi=' + reply.bpi, reply.bpi, reply.name)
      } else if (reply.file) {
        app.tabShow(reply.url, reply.id, _('result'))
      }
      if (next) {
        next()
      }
    })
  }
  webix.attachEvent('onAjaxError', function (req) {
    if (req.status === 401) {
      if (app.online) {
        app.online = false
        webix.message(_('sessionExpired'), 'error')
        app.getService('user').logout()
      }
    } else {
      webix.message('Hay problemas de comunicación, por favor reintente... (' + req.status + ')', 'error')
    }
  })
  webix.cdn = window.location.origin + '/codebase'
  webix.env.cdn = window.location.origin + '/codebase'
  app.attachEvent('app:render', function () {
    var context = app.getService('user').getUser()
    if (context && !app.socket) {
      app.conn(context)
    }
  })
  app.attachEvent('app:error', function (err) {
    if (app.debug) {
      webix.message(err)
    } else {
      console.log(err)
    }
  })
  app.attachEvent('app:user:login', function (context) {
    var login = $$('wlogin')
    if (login) {
      login.close()
    }
    app.online = true
    webix.message(_('welcome'), 'info')
    if (!app.socket) {
      app.conn(context)
    }
    webix.ajax().get(_api + 'settings.get?_id=settings').then(function (data) {
      app.settings = data.json()
      webix.storage.local.put('settings', app.settings)
    })
  })
  app.attachEvent('app:user:logout', function () {
    app.socket.close()
    delete app.socket
    app.show('/login')
    webix.message(_('bye'), 'info')
  })
  app.conn = function (context, reconnect) {
    if (reconnect) {
      app.socket.emit('init', { user: context.user, room: context.room, reconnect: reconnect })
    } else {
      app.socket = io(_host, { path: /* window.location.pathname + */ '/socket.io', transports: ['websocket'] })
      app.socket.emit('init', { user: context.user, room: context.room })
      app.socket.on('reconnect', function () {
        var context = app.getService('user').getUser()
        if (context) {
          app.conn(context, true)
        }
        console.log('Reconnecting');
      })
      app.socket.once('exit', function (data) {
        if (context.user === data._id) {
          app.connected = false
        }
      })
      app.socket.on('email', function (data) {
        data.run = 'email'
        app.createNotification(_('email'), data.message, data)
      })
      app.socket.on('start', function (data) {
        data.run = 'start'
        app.connected = true
        app.createNotification(_('project'), data.message, data)
      })
      app.socket.on('notification', function (data) {
        data.run = 'notification'
        var text = ''
        $$('badgeNotification').config.badge = $$('badgeNotification').config.badge + 1
        $$('badgeNotification').refresh()
        var action = ''
        switch (data.noti.type) {
          case 1:
            action = 'created'
            break
          case 2:
            action = 'modified'
            break
          case 3:
            action = 'started'
            break
          case 4:
            action = 'changed'
            break
          case 5:
            action = 'received'
            break
          case 6:
            action = 'seen'
            break
          default:
            break
        }
        text = _(action) + ' ' + _(data.noti.collection) + ' ' + data.doc.name
        app.createNotification(_('notification'), text, data)
      })
      app.socket.on('comment', function (data) {
        data.run = 'comment'
        app.createNotification(_('comment'), data.message, data)
        $$('badgeComment').config.badge = $$('badgeComment').config.badge + 1
        $$('badgeComment').refresh()
        if ($$('dt-popupComments')) { $$('dt-popupComments').load($$('dt-popupComments').config.url) }
      })
      app.socket.on('reminder', function (data) {
        if (data.comment) {
          if ($$('badgeComment')) {
            $$('badgeComment').config.badge = $$('badgeComment').config.badge + data.comment
            $$('badgeComment').refresh()
          }
        }
      })
      app.socket.on('notifications', function (data) {
        if ($$('badgeNotification')) {
          $$('badgeNotification').config.badge = /* $$('badgeNotification').config.badge + */ data
          $$('badgeNotification').refresh()
        }
      })
      app.socket.on('alamrs', function (data) {
        if ($$('badgeAlarm')) {
          $$('badgeAlarm').config.badge = /* $$('badgeAlarm').config.badge + */ data
          $$('badgeAlarm').refresh()
        }
      })
      app.socket.on('chats', function (data) {
        if ($$('chats')) {
          $$('chats').config.badge = /* $$('chats').config.badge + */ data
          $$('chats').refresh()
        }
      })
      app.socket.on('alarm', function (data) {
        data.run = 'alarm'
        app.createNotification(_('alarm'), data.message, data)
        $$('badgeAlarm').config.badge = $$('badgeAlarm').config.badge + data.count
        $$('badgeAlarm').refresh()
        if ($$('dt-overdue')) { $$('dt-overdue').load($$('dt-overdue').config.url) }
        if ($$('dt-today')) { $$('dt-today').load($$('dt-today').config.url) }
        if ($$('dt-next')) { $$('dt-next').load($$('dt-next').config.url) }
      })
      app.socket.on('chat', function (data) {
        data.run = 'chat'
        //if(!['chatTest', 'chat'].includes($$('multi').getValue())) {
        if (data._id.toString() !== $$('multiviewGlobal').getValue()) {
          app.createNotification(_('message'), data.fromName + ' te ha enviado un mensaje', data)
          $$('chats').config.badge = $$('chats').config.badge + 1
          $$('chats').refresh()
        }
      })
    }
  }

  app.createNotification = function (title, message, data) {
    cordova.plugins.notification.local.schedule([
      { id: 1, group: 'gpax', groupSummary: true, smallIcon: 'res://icon.png' },
      {
        id: webix.uid(),
        group: 'gpax',
        smallIcon: 'res://icon.png',
        title: title,
        text: message,
        vibrate: true,
        data: data
      }
    ], function () {
      navigator.vibrate(1500)
    })
  }
  app.Email = function (data) {
    return false
    app.multiShow('document.document?_id=' + data.id + '&issued=1', data.id, 'document')
  }
  app.Start = function (data) {
    return false
    var context = app.getService('user').getUser()
    webix.ajax().post(_api + 'project.details?_id=' + data.id, (txt, res, req) => {
      if (req.status === 200) {
        const projectData = JSON.parse(txt)
        var department = false

        var manager = false

        var member = false

        var projectStatus = projectData.status

        var departmentContext = false
        if (projectData.manager && context.user.toString() === projectData.manager.toString()) {
          manager = true
        }
        if (projectData.members && projectData.members.length) {
          for (var m in projectData.members) {
            if (context.user.toString() === projectData.members[m].toString()) {
              member = true
              break
            }
          }
        }
        if (context.managerUnits && projectData.unit) {
          for (var i in context.managerUnits) {
            if (context.managerUnits[i] === projectData.unit) {
              departmentContext = true
              if (projectData.status === 'draft') { department = true } else { department = false }
              break
            }
          }
        }
        if (context.assistantUnits && projectData.unit && !departmentContext) {
          for (var u in context.assistantUnits) {
            if (context.assistantUnits[u] === projectData.unit) {
              if (projectData.status === 'draft') { department = true } else { department = false }
              break
            }
          }
        }
        webix.ajax().post(_api + 'project.gantt?_id=' + data.id, (doc, res, req) => {
          if (req.status === 200) {
            var owners = true
            const ganttData = JSON.parse(doc)
            if (ganttData.content) {
              var Data = ganttData.content.gantt.data
              for (var d in Data) {
                if ((Data[d].type === 'task' && !Data[d].owner_id) || (Data[d].type === 'task' && Data[d].owner_id === '')) {
                  owners = false
                  break
                }
              }
            }
            app.multiShow('project.project?_id=' + data.id + '&department=' + department + '&owners=' + owners + '&manager=' + manager + '&departmentContext=' + departmentContext + '&projectStatus=' + projectStatus + '&member=' + member, data.id, data.subject)
          } else {
            webix.message('Error ' + req.status + ', please retry...', 'error')
          }
        })
      } else {
        webix.message('Error ' + req.status + ', please retry...', 'error')
      }
    })
  }

  app.Notification = function (data) {
    if (data.noti.collection === 'project') {
      return false
      var context = app.getService('user').getUser()
      webix.ajax().post(_api + 'project.details?_id=' + data.noti.document.id).then((res) => {
        const projectData = res.json()
        var department = false

        var manager = false

        var member = false

        var projectStatus = projectData.status

        var departmentContext = false
        if (projectData.manager && context.user.toString() === projectData.manager.toString()) {
          manager = true
        }
        if (projectData.members && projectData.members.length) {
          for (var m in projectData.members) {
            if (context.user.toString() === projectData.members[m].toString()) {
              member = true
              break
            }
          }
        }
        if (context.managerUnits && projectData.unit) {
          for (var i in context.managerUnits) {
            if (context.managerUnits[i] === projectData.unit) {
              departmentContext = true
              if (projectData.status === 'draft') { department = true } else { department = false }
              break
            }
          }
        }
        if (context.assistantUnits && projectData.unit && !departmentContext) {
          for (var u in context.assistantUnits) {
            if (context.assistantUnits[u] === projectData.unit) {
              if (projectData.status === 'draft') { department = true } else { department = false }
              break
            }
          }
        }
        webix.ajax().post(_api + 'project.gantt?_id=' + data.noti.document.id).then((res) => {
          var owners = true
          const ganttData = res.json()
          if (ganttData.content) {
            var Data = ganttData.content.gantt.data
            for (var d in Data) {
              if ((Data[d].type === 'task' && !Data[d].owner_id) || (Data[d].type === 'task' && Data[d].owner_id === '')) {
                owners = false
                break
              }
            }
          }
          app.multiShow('project.project?_id=' + data.noti.document.id.toString() + '&department=' + department + '&owners=' + owners + '&manager=' + manager + '&departmentContext=' + departmentContext + '&projectStatus=' + projectStatus + '&member=' + member, data.noti.document.id.toString(), data.doc.name)
        })
      })
    } else {
      app.multiShow(data.noti.path + '?_id=' + data.noti.document.id.toString(), data.noti.document.id.toString(), _(data.noti.collection))
    }
  }
  app.comment = function (data) {
    var comment = data.comment
    if (comment.collection === 'document' && comment.documentType === 'redactor') { comment.documentType = 'document' }
    if (comment.issued) { app.multiShow(comment.collection + '.' + comment.documentType + '?_id=' + comment.document + '&issued=1', comment.document, comment.collection) } else { app.multiShow(comment.collection + '.' + comment.documentType + '?_id=' + comment.document, comment.document, comment.collection) }
    webix.ajax().post(_api + 'comment.removeUnread', { _id: comment._id }, (txt, res, req) => {
      if (req.status === 200) {
        if ($$('dt-popupComments')) { $$('dt-popupComments').load($$('dt-popupComments').config.url) }
      } else {
        webix.message('Error ' + req.status + ', please retry...', 'error')
      }
    })
  }
  app.alarm = function (data) {
    app.multiShow('alarms', 'alarms', _('alarms'))
    $$('badgeAlarm').config.badge = 0
    $$('badgeAlarm').refresh()
  }
  app.chat = function (data) {
    app.multiShow('chat.chats', 'chatsView')
    $$('chats').config.badge = 0
    $$('chats').refresh()
  }
})
