/* global webix _ _api $$ moment */
import { JetView } from 'webix-jet'
export default class Chat extends JetView {
  config() {
    moment.locale('es')
    var context = this.app.getService('user').getUser()
    this.uid = '.' + context.user.toString()
    this.uploaderFile = webix.ui({
      id: 'uploadFile' + this.uid,
      view: 'uploader',
      accept: "text/plain, text/html, application/vnd.ms-excel, application/pdf, application/zip, application/x-7z-compressed, application/x-rar-compressed, video/x-msvideo, application/msword, application/vnd.oasis.opendocument.spreadsheet, application/vnd.oasis.opendocument.text, application/vnd.ms-powerpoint",
      name: 'uploader',
      apiOnly: true,
      on: {
        onAfterFileAdd: webix.bind(this.sendFile, this),
      },
    })
    return {
      id: 'abslFormChat' + this.uid,
      view: 'abslayout',
      rows: [
        {
          view: 'form',
          padding: 0,
          relative: true,
          id: 'formChat' + this.uid,
          on: {
            onValues: webix.bind(this.read, this),
          },
          elements: [
            {
              cols: [
                {
                  view: 'template',
                  id: 'userImg' + this.uid,
                  template: '',
                  borderless: true,
                  height: 50,
                  padding: 0
                },
                {
                  view: 'button',
                  id: 'actorsChat' + this.uid,
                  icon: 'mdi mdi-information-outline',
                  type: 'iconTop',
                  css: 'toolbarButton',
                  width: 30,
                  click: webix.bind(this.showActors, this)
                }
              ]
            },
            {
              view: "dataviewBasic",
              id: 'chat' + context.user.toString(),
              name: 'messages',
              select: false,
              xCount: 1,
              autoheigth: 1,
              type: {
                width: "auto",
                height: "auto"
              },
              on: {
                onItemClick: webix.bind(this.showMsg, this),
              },
              template: (obj) => {
                if (obj.type === 'file') {
                  obj.message = '<a class="fr-file" href="' + _api + 'file.get?_id=' + obj.fileId + '&type=txt" onclick="return false;">' + obj.fileName + '</a>'
                }
                if (obj.type === 'image') {
                  obj.message = '<img src="' + _api + 'file.get?_id=' + obj.fileId + '&type=png" style="max-width: 100%; max-height: 100%;" class="fr-fic fr-dib">'
                }
                if (obj.type === 'audio') {
                  obj.message = '<audio controls preload="none"><source src="' + _api + 'file.get?_id=' + obj.fileId + '"></audio>'
                }
                if (context.user.toString() === obj.user.toString()) {
                  // <span class="tick tick-animation">
                  //</span>
                  let seen = obj.actors.findIndex((a) => {
                    return a.seen === '0'
                  })
                  return `<div id="${obj.id}" class="message sent">
                          ${obj.message}
                          <span class="metadata">
                            ${seen !== -1 ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#02c92a"/></svg>'}
                          
                              <span class="time">${moment(obj.date).format('DD MMM YYYY h:mm a')}</span>
                          </span>
                        </div>`
                } else {
                  let actorsChat = $$('formChat' + this.uid).getValues().actors
                  let color
                  actorsChat.findIndex((a) => {
                    if (a.user.toString() === obj.user.toString())
                      color = a.color
                  })
                  if (color) {
                    return `<div id="${obj.id}" class="message received">
                        <div style="color: ${color}" class="nameMsgTeam">${obj.name}</div></br>
                          ${obj.message}
                          <span class="metadata"><span class="time">${moment(obj.date).format('DD MMM YYYY h:mm a')}</span></span>
                        </div>`
                  } else {
                    return `<div id="${obj.id}" class="message received">
                          ${obj.message}
                          <span class="metadata"><span class="time">${moment(obj.date).format('DD MMM YYYY h:mm a')}</span></span>
                          </div>`
                  }
                }
              },
              css: "rowsChat",
              relative: true
            },
            {
              //view: "toolbar",
              cols: [
                {
                  rows: [
                    { view: 'button', css: { 'z-index': 99999999999999999 }, id: 'emoji' + this.uid, type: 'iconTop', icon: 'mdi mdi-sticker-emoji', css: 'toolbarButton', width: 30 },
                    {
                      view: 'button',
                      icon: 'mdi mdi-image',
                      type: 'iconTop',
                      css: 'toolbarButton',
                      width: 30,
                      click: webix.bind(this.image, this)
                    }]
                },
                {
                  rows: [
                    {
                      view: 'button',
                      icon: 'mdi mdi-paperclip',
                      type: 'iconTop',
                      css: 'toolbarButton',
                      width: 30,
                      click: webix.bind(this.file, this)
                    },
                    {
                      view: 'button',
                      icon: 'mdi mdi-microphone',
                      css: 'toolbarButton',
                      id: 'startRecorder' + this.uid,
                      type: 'iconTop',
                      width: 30,
                      click: webix.bind(this.startRecorder, this)
                    }]
                },
                {
                  padding: 0,
                  cells: [
                    {
                      view: "textarea",
                      id: 'message' + this.uid,
                      placeholder: _('message'),
                      on: {
                        onKeyPress: webix.bind(this.typing, this)
                      }
                    },
                    {
                      view: "template",
                      css: 'recording',
                      id: 'templateRecording' + this.uid,
                      template: '<div class="recording"></div>'
                    }
                  ]
                },
                { view: 'button', id: 'sendMsg' + this.uid, type: 'iconTop', icon: 'mdi mdi-arrow-right-box', css: 'toolbarButton', height: 40, width: 40, click: webix.bind(this.save, this) }
              ]
            },
          ]
        }
      ]
    }
  }

  init() {
    var id = this.getParam('_id', true)
    var user = this.getParam('user', true)
    var newTeam = this.getParam('newTeam', true)
    var newTeamProject = this.getParam('newTeamProject', true)
    if (id) {
      $$('formChat' + this.uid).load(_api + 'chat.get?_id=' + id)
    } else if (user) {
      $$('formChat' + this.uid).load(_api + 'chat.get?user=' + user)
    } else if (newTeam) {
      $$('formChat' + this.uid).load(function () {
        return webix.ajax().post(_api + "chat.newTeam", newTeam)
      })
    } else if (newTeamProject) {
      $$('formChat' + this.uid).load(function () {
        return webix.ajax().post(_api + "chat.newTeam", { project: id })
      })
    }
    $$('emoji' + this.uid)
    const button = $$('emoji' + this.uid).getNode()
    const picker = new EmojiButton();

    picker.on('emoji', emoji => {
      let message = $$('message' + this.uid).getValue()
      message += emoji
      $$('message' + this.uid).setValue(message)
    })

    button.addEventListener('click', () => {
      picker.togglePicker(button);
    });
    this.app.socket.on('received', webix.bind((data) => {
      var context = this.app.getService('user').getUser()
      let idChat = $$('formChat' + this.uid).getValues()._id
      for (let t in data.to) {
        var dt = $$('chat' + data.to[t].toString())
        if (idChat && dt && data.idChat.toString() === idChat.toString() && data.from.toString() !== context.user.toString()) {
          dt.add(data.message)
          let row_id = dt.getLastId();
          dt.showItem(row_id);
          //  dt.adjustRowHeight()
          this.app.socket.emit('seenMsg', {
            user: data.to[t].toString()
          })
          var msg = document.getElementById('typing' + this.uid)
          msg.innerHTML = ""
          webix.ajax().get(_api + 'chat.read?_id=' + idChat)
        }
      }

      if (data.isNew) {
        let values = $$('formChat' + this.uid).getValues()
        delete values.isNew
        $$('formChat' + this.uid).setValues(values)
        $$('chats' + this.uid).clearAll()
        $$('chats' + this.uid).load($$('chats' + this.uid).config.url)
      } else {
        $$('chats' + this.uid).load($$('chats' + this.uid).config.url).finally(() => {
          $$('chats' + this.uid).sort("#lastDate#", "desc");
        });
      }
    }, this))
    this.app.socket.on('typing', webix.bind((data) => {
      var msg = document.getElementById('typing' + this.uid)
      let idChat = $$('formChat' + this.uid).getValues()._id
      let team = $$('formChat' + this.uid).getValues().team
      if (idChat && data.idChat.toString() === idChat.toString()) {
        if (data.type === 'audio') {
          msg.innerHTML = team ? data.name + ' ' + _('recordingAudio') : _('recordingAudio')
        } else {
          msg.innerHTML = team ? data.name + ' ' + _('typing') : _('typing')
        }
      }
    }, this))
    this.app.socket.on('stopTyping', webix.bind((data) => {
      var msg = document.getElementById('typing' + this.uid)
      let idChat = $$('formChat' + this.uid).getValues()._id
      if (idChat && data.idChat.toString() === idChat.toString()) {
        msg.innerHTML = ""
      }
    }, this))

    this.app.socket.on('seenMsg', webix.bind((data) => {
      var context = this.app.getService('user').getUser()
      let dt = $$('chat' + context.user.toString())
      dt.find(function (record) {
        record.actors.findIndex((a) => {
          if (a.user.toString() === data.user.toString()) {
            a.seen = '1'
          }
        })
        dt.updateItem(record.id, record)
      })
    }, this))
  }

  read() {
    // this.recorder && this.recorder.clear();
    // this.gumStream && this.gumStream.getAudioTracks()[0].stop()
    $$('templateRecording' + this.uid) && $$('templateRecording' + this.uid).setHTML('<div class="recording"></div>')
    $$('message' + this.uid).show()
    // $$('stopRecorder' + this.uid) && $$('stopRecorder' + this.uid).hide()
    // $$('cancelRecorder' + this.uid) && $$('cancelRecorder' + this.uid).hide()
    $$('startRecorder' + this.uid) && $$('startRecorder' + this.uid).show()
    var context = this.app.getService('user').getUser()
    let idChat = $$('formChat' + this.uid).getValues()._id
    let actors = $$('formChat' + this.uid).getValues().actors
    if (actors.length === 2) {
      let a = actors.findIndex((a) => {
        return a.user.toString() !== context.user.toString()
      })
      let obj = actors[a]
      let doc = webix.ajax().sync().post(_api + 'user.getProperties', { _id: obj.user, properties: { name: 1 } })
      doc = JSON.parse(doc.responseText);
      let html = `<div style="position: relative;">
                <span>
                <img class="photo" style="float: left;width:44px;height:44px;" src="${_api}user.image?size=24&_id=${doc._id}">
                <span style="font-weight: bold" >${doc.name.replace(/(<([^>]+)>)/g, '')}</span></br>
                <span id="typing${this.uid}" style="font-style: oblique; color:red"></span>
                </span>
                </div>
                <!-- The Modal -->
                  <div id="myModal" class="modal">

                   <!-- The Close Button -->
                   <span class="close" onclick="document.getElementById('myModal').style.display='none'">&times;</span>

                   <!-- Modal Content (The Image) -->
                   <div class="tiles">
                    <img class="modal-content" id="img01">
                   </div>
                   <!-- Modal Caption (Image Text) -->
                   <div id="caption"></div>
                   <button id="btnLeft" class="w3-button w3-display-left w3-black" ">&#10094;</button>
                    <button id="btnRight" class="w3-button w3-display-right w3-black" ">&#10095;</button>
                   </div>`
      $$('userImg' + this.uid).setHTML(html)
    } else {
      let name = $$('formChat' + this.uid).getValues().name
      let html = `<div style="position: relative;">
                <span>
                <div class="avatar small">
                 <span>${this.createNameAvatarTeam(name)}</span>
                </div>
                <span style="font-weight: bold" >${name}</span></br>
                <span id="typing${this.uid}" style="font-style: oblique; color:red"></span>
                </span>
                </div>
                <!-- The Modal -->
                  <div id="myModal" class="modal">

                   <!-- The Close Button -->
                   <span class="close" onclick="document.getElementById('myModal').style.display='none'">&times;</span>

                   <!-- Modal Content (The Image) -->
                   <div class="tiles">
                    <img class="modal-content" id="img01">
                   </div>
                   <!-- Modal Caption (Image Text) -->
                   <div id="caption"></div>
                   <button id="btnLeft" class="w3-button w3-display-left w3-black" ">&#10094;</button>
                    <button id="btnRight" class="w3-button w3-display-right w3-black" ">&#10095;</button>
                   </div>`
      $$('userImg' + this.uid).setHTML(html)
    }

    this.app.socket.emit('seenMsg', {
      user: context.user.toString()
    })
    let row_id = $$('chat' + context.user.toString()).getLastId();
    $$('chat' + context.user.toString()).showItem(row_id);
    webix.ajax().get(_api + 'chat.read?_id=' + idChat)
  }

  createNameAvatarTeam(name) {
    return name
      .split(' ')
      .map(item => item.charAt(0))
      .slice(0, 2)
      .join('');
  }

  startRecorder() {
    var context = this.app.getService('user').getUser()
    // this.audio_context;
    // this.recorder;

    /* let startUserMedia= (stream) => {
    this.gumStream = stream 
    var input = this.audio_context.createMediaStreamSource(stream);
    console.log('Media stream created.');
     
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
      
    this.recorder = new Recorder(input, { 
      numChannels: 1
    }); */

    navigator.device.audiorecorder.recordAudio(webix.bind(this.stopRecorder, this), webix.bind(this.cancelRecorder, this));
    // console.log('Recorder initialised.');
    let idChat = $$('formChat' + this.uid).getValues()._id
    $$('templateRecording' + this.uid).show()
    $$('templateRecording' + this.uid).setHTML(`<div class="recording loading recording1">
    <span>G</span>
    <span>r</span>
    <span>a</span>
    <span>b</span>
    <span>a</span>
    <span>n</span>
    <span>d</span>
    <span>o</span>
    <span>.</span>
    <span>.</span>
    <span>.</span>
    </div>`)
    /*
    // this.recorder && this.recorder.record();
    console.log('Recording...')
    $$('startRecorder' + this.uid).hide()
    $$('stopRecorder' + this.uid).show()
    $$('cancelRecorder' + this.uid).show() */

    this.app.socket.emit('typing', {
      idChat: idChat,
      type: 'audio',
      name: context.name
    })
    //}


    /* try {
    // webkit shim
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      window.URL = window.URL || window.webkitURL;
        
      this.audio_context = new AudioContext;
      console.log('Audio context set up.');
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
      alert('No web audio support in this browser!');
    }
      
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
      console.log('No live audio input: ' + e);
    }) */
  }

  stopRecorder(mediaFiles) {
    mediaFiles = JSON.parse(mediaFiles)
    let idChat = $$('formChat' + this.uid).getValues()._id
    // this.recorder && this.recorder.stop();
    // this.gumStream.getAudioTracks()[0].stop()
    console.log('Stopped recording.');
    // $$('stopRecorder' + this.uid).hide()
    // $$('cancelRecorder' + this.uid).hide()
    $$('templateRecording' + this.uid).setHTML(`<div style="float:left;"><div class="recording loading recording1">
      <span>C</span>
      <span>a</span>
      <span>r</span>
      <span>g</span>
      <span>a</span>
      <span>n</span>
      <span>d</span>
      <span>o</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
      </div><div class="recording" style="background:#ff8080;float:right;"><div id="progress" style="display:none;"></div>
      <div id="progress-bar" style="background:#CCFF66;" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>`)
    this.app.socket.emit('stopTyping', {
      idChat: idChat
    })

    var ft = new FileTransfer()
    var path = mediaFiles.full_path
    var name = mediaFiles.file_name
    ft.onprogress = function (progressEvent) {
      if (progressEvent.lengthComputable) {
        var percentage = (progressEvent.loaded / progressEvent.total) * 100;
        document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
        document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
      }
    };
    ft.upload(path,
      encodeURI(_api + 'chat.file'),
      webix.bind((result) => {
        let file = JSON.parse(result.response)
        document.getElementById('progress-bar').style.width = '0%'
        document.getElementById('progress').style.display = 'none'
        if (file.id) {
          let message = {
            fileId: file.id,
            type: 'audio'
          }
          $$('templateRecording' + this.uid).setHTML('<div class="recording"></div>')
          $$('message' + this.uid).show()
          $$('startRecorder' + this.uid).show()
          this.save(message)
        }
        console.log('Upload success: ' + result.responseCode);
        console.log(result.bytesSent + ' bytes sent');
      }, this),
      function (error) {
        navigator.notification.alert('Error uploading file ' + path + ': ' + error.code);
        //console.log('Error uploading file ' + path + ': ' + error.code);
      },
      { fileName: name });
    // this.recorder && this.recorder.exportWAV((blob) => {
    /*  let fd = new FormData;
     fd.append("upload", blob, new Date().toISOString() + '.wav')
    let doc = webix.ajax().sync().post(_api + 'chat.file', fd)
    let file = JSON.parse(doc.responseText)
    if(file.id) {
      let message ='<audio controls><source src="/api/file.get?_id=' +file.id + '" type="audio/wav"></audio>'
      $$('templateRecording'+ this.uid).setHTML('<div class="recording"></div>')
      $$('message' + this.uid).show()
      $$('startRecorder' + this.uid).show()
      // this.save(message)
    } */
    /* var formData = new FormData()
    document.getElementById('progress').style.display = 'block'
    formData.append("uploadfile", blob, new Date().toISOString() + '.wav')
    var xhr = new XMLHttpRequest();
    xhr.open('post', _api + 'chat.file', true);
    xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
    var percentage = (e.loaded / e.total) * 100;
    document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
    document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
    }
    };
    xhr.onerror = function(e) {
    alert('An error occurred while submitting the form. Maybe your file is too big');
    };
    xhr.onload = () => {
    let file = JSON.parse(xhr.responseText)
    document.getElementById('progress-bar').style.width ='0%'
    document.getElementById('progress').style.display = 'none'
    if(file.id) {
      let message ='<audio controls preload="none"><source src="/api/file.get?_id=' +file.id + '" type="audio/wav"></audio>'
      $$('templateRecording'+ this.uid).setHTML('<div class="recording"></div>')
      $$('message' + this.uid).show()
      $$('startRecorder' + this.uid).show()
      this.save(message)
    }
    }
    xhr.send(formData);
  }) */
    //this.recorder.clear(); 
  }


  cancelRecorder() {
    let idChat = $$('formChat' + this.uid).getValues()._id
    this.app.socket.emit('stopTyping', {
      idChat: idChat
    })
    $$('templateRecording' + this.uid).setHTML('<div class="recording"></div>')
    $$('message' + this.uid).show()
    // $$('stopRecorder' + this.uid).hide()
    // $$('cancelRecorder' + this.uid).hide()
    $$('startRecorder' + this.uid).show()
    // this.recorder && this.recorder.clear();
    // this.gumStream && this.gumStream.getAudioTracks()[0].stop()
  }

  showActors(s, e) {
    let form = $$('formChat' + this.uid)
    let idChat = form.getValues()._id
    let actors = form.getValues().actors
    let ids = []
    for (let a in actors) {
      ids.push(actors[a].user.toString())
    }
    this.popupActors = webix.ui({
      view: 'popup',
      body: {
        view: 'datatable',
        css: 'webix_data_border',
        header: false,
        columns: [
          {
            id: 'value',
            sort: 'string',
            width: 200,
            template: function (obj) {
              return '<span title="' + obj.name.replace(/(<([^>]+)>)/g, '') + '"><img class="photo" style="width:24px;height:24px;" src="' + _api + 'user.image?size=24&_id=' + obj.id + '">' + obj.name + '</span>&nbsp'
            }
          }
        ],
        url: _api + 'chat.getReviewers?ids=' + ids,
        autowidth: true,
        maxHeight: 200
      }
    })
    this.popupActors.show(e.srcElement, { pos: 'bottom' })
  }

  image() {
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
        navigator.camera.getPicture(webix.bind(this.sendImage, this), onFail, options)
      }
    }
    navigator.notification.confirm(
      '', // message
      onConfirm,            // callback to invoke with index of button pressed
      _('Insert') + '...',           // title
      ['Hacer foto', 'Desde galería']     // buttonLabels
    )

    function onFail(message) {
      if (message !== 'No Image Selected') {
        alert('Failed because: ' + message);
      }
    }
  }

  file() {
    if (this.uploaderFile) {
      this.uploaderFile.fileDialog()
    }
  }

  sendImage(imageURI) {
    // var blob = new Blob(file, {type : file.type}); // the blob
    $$('templateRecording' + this.uid).show()
    $$('templateRecording' + this.uid).setHTML(`<div style="float:left;"><div class="recording loading recording1">
      <span>C</span>
      <span>a</span>
      <span>r</span>
      <span>g</span>
      <span>a</span>
      <span>n</span>
      <span>d</span>
      <span>o</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
      </div><div class="recording" style="background:#ff8080;float:right;"><div id="progress" style="display:none;"></div>
      <div id="progress-bar" style="background:#CCFF66;" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>`)
    var form = $$('formChat' + this.uid)
    var data = {
      _id: form.getValues()._id,
      actors: form.getValues().actors
    }
    if (form.getValues().project) {
      data.project = form.getValues().project
    }
    var ft = new FileTransfer()
    var path = imageURI
    var name = new Date().toISOString() + '.JPEG'
    ft.onprogress = function (progressEvent) {
      if (progressEvent.lengthComputable) {
        var percentage = (progressEvent.loaded / progressEvent.total) * 100;
        document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
        document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
      }
    };
    ft.upload(path,
      encodeURI(_api + 'chat.file'),
      webix.bind((result) => {
        let file = JSON.parse(result.response)
        document.getElementById('progress-bar').style.width = '0%'
        document.getElementById('progress').style.display = 'none'
        if (file.id) {
          let message = {
            fileId: file.id,
            type: 'image'
          }
          $$('templateRecording' + this.uid).setHTML('<div class="recording"></div>')
          $$('message' + this.uid).show()
          this.save(message)
          data.idFile = file.id
          webix.ajax().post(_api + 'chat.addFileToProject', data).then((res) => { })
        }
        console.log('Upload success: ' + result.responseCode);
        console.log(result.bytesSent + ' bytes sent');
      }, this),
      function (error) {
        navigator.notification.alert('Error uploading file ' + path + ': ' + error.code);
        //console.log('Error uploading file ' + path + ': ' + error.code);
      },
      { fileName: name });
    /* var formData = new FormData()
       document.getElementById('progress').style.display = 'block'
       formData.append("uploadfile", file.file, new Date().toISOString() + '.' + file.name)
       var xhr = new XMLHttpRequest();
       xhr.open('post', _api + 'chat.file', true);
       xhr.upload.onprogress = function(e) {
       if (e.lengthComputable) {
       var percentage = (e.loaded / e.total) * 100;
       document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
       document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
       }
       };
       xhr.onerror = function(e) {
       alert('An error occurred while submitting the form. Maybe your file is too big');
       };
       xhr.onload = () => {
       let file = JSON.parse(xhr.responseText)
       document.getElementById('progress-bar').style.width ='0%'
       document.getElementById('progress').style.display = 'none'
       if(file.id) {
         let message = '<img src="/api/file.get?_id=' +file.id + '&type=png" style="width: 300px;" class="fr-fic fr-dib">'
         $$('templateRecording'+ this.uid).setHTML('<div class="recording"></div>')
         $$('message' + this.uid).show()
         this.save(message)
       }
       }
       xhr.send(formData) */
  }
  sendFile(file, response) {
    $$('templateRecording' + this.uid).show()
    $$('templateRecording' + this.uid).setHTML(`<div style="float:left;"><div class="recording loading recording1">
      <span>C</span>
      <span>a</span>
      <span>r</span>
      <span>g</span>
      <span>a</span>
      <span>n</span>
      <span>d</span>
      <span>o</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
      </div><div class="recording" style="background:#ff8080;float:right;"><div id="progress" style="display:none;"></div>
      <div id="progress-bar" style="background:#CCFF66;" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>`)
    var form = $$('formChat' + this.uid)
    var data = {
      _id: form.getValues()._id,
      actors: form.getValues().actors
    }
    if (form.getValues().project) {
      data.project = form.getValues().project
    }
    var formData = new FormData()
    document.getElementById('progress').style.display = 'block'
    formData.append("uploadfile", file.file, new Date().toISOString() + '.' + file.name)
    var xhr = new XMLHttpRequest();
    xhr.open('post', _api + 'chat.file', true);
    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
        document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
      }
    };
    xhr.onerror = function (e) {
      alert('An error occurred while submitting the form. Maybe your file is too big');
    };
    xhr.onload = () => {
      let doc = JSON.parse(xhr.responseText)
      document.getElementById('progress-bar').style.width = '0%'
      document.getElementById('progress').style.display = 'none'
      if (doc.id) {
        let message = {
          fileId: doc.id,
          fileName: file.name,
          type: 'file'
        }
        $$('templateRecording' + this.uid).setHTML('<div class="recording"></div>')
        $$('message' + this.uid).show()
        this.save(message)
        data.idFile = file.id
        webix.ajax().post(_api + 'chat.addFileToProject', data).then((res) => { })
      }
    }
    xhr.send(formData)

  }

  /* showMsg (id, e, node){
    let context = this.app.getService('user').getUser()
    var temRer = $$('templateRecording'+ this.uid)
    var msgMt = $$('message' + this.uid)
    var item = $$('chat' + context.user.toString()).getItem(id)
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
    if(e.toElement && e.toElement.tagName === 'IMG') {
        window.resolveLocalFileSystemURL(storageLocation + item.fileId+ '.png', function (fileEntry){
        cordova.plugins.fileOpener2.open(storageLocation + item.fileId+ '.png')
      }, function (){
          DownloadToDevice(e.toElement.src, 'png')
      });
    } else if(e.toElement && e.toElement.tagName === 'A'){
      let ext= item.fileName.split('.')
      ext = ext[ext.length-1]
       window.resolveLocalFileSystemURL(storageLocation + item.fileId + '.' + ext, function (fileEntry){
        cordova.plugins.fileOpener2.open(storageLocation + item.fileId + '.' + ext)
      }, function (){
          DownloadToDevice(e.toElement.href, ext)
      });
    }

    function DownloadToDevice(fileurl, ext) {
      temRer.show()
      temRer.setHTML(`<div style="float:left;"><div class="recording loading recording1">
      <span>C</span>
      <span>a</span>
      <span>r</span>
      <span>g</span>
      <span>a</span>
      <span>n</span>
      <span>d</span>
      <span>o</span>
      <span>.</span>
      <span>.</span>
      <span>.</span>
      </div><div class="recording" style="background:#ff8080;float:right;"><div id="progress" style="display:none;"></div>
      <div id="progress-bar" style="background:#CCFF66;" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">0%</div></div></div>`)
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", fileurl);
      xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
      xhr.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        document.getElementById('progress-bar').style.width = percentage.toFixed(0) + '%'
        document.getElementById('progress-bar').innerHTML = percentage.toFixed(0) + '%'
        }else {
          let disSize
          let position = e.loaded
           if(position=>1000000) {
              disSize = (parseFloat(position)/1000000).toFixed(2)+' MB';
          }
          else if(position=>1000 && postion<1000000) {
              disSize = (parseFloat(position)/1000).toFixed(2)+' KB';
          }
          document.getElementById('progress-bar').style.width = '100%'
          document.getElementById('progress-bar').innerHTML = position + ' | ' + disSize
        }
      };
      xhr.onload = function(){
          blob = xhr.response;//xhr.response is now a blob object
        document.getElementById('progress-bar').style.width ='0%'
        document.getElementById('progress').style.display = 'none'
        temRer.setHTML('<div class="recording"></div>')
        msgMt.show()
        var folderpath = storageLocation;
        var filename = item.fileId+ '.' + ext
        var DataBlob = blob;
          window.resolveLocalFileSystemURL(folderpath, function(dir) {
            dir.getFile(filename, {create:true}, function(file) {
                    file.createWriter(function(fileWriter) {
                      //Download was succesfull
                      fileWriter.onwrite = function(evt) {
                        console.log("write success");
                        window.galleryRefresh.refresh(
                        folderpath,
                        function(success){ 
                          cordova.plugins.fileOpener2.open(folderpath + filename)
                         },
                        function(error){ console.log(error); }
                       );
                      };
                        fileWriter.write(DataBlob);
                    }, function(err){
                      // failed
                      console.log(err);
                    });
            });
          });
      }
      xhr.send();
    }    
  } */

  typing(code, e) {
    var context = this.app.getService('user').getUser()
    let message = $$('message' + this.uid).getValue()
    let idChat = $$('formChat' + this.uid).getValues()._id
    if (message === null || message === '' || message === '<br><br>') {
      this.app.socket.emit('stopTyping', {
        idChat: idChat
      })
      return;
    }
    this.app.socket.emit('typing', {
      idChat: idChat,
      name: context.name
    })
  }

  save(messageSend) {
    var context = this.app.getService('user').getUser()
    let data = $$('formChat' + this.uid).getValues()
    // si no incluye id del boton envia el mensaje entrante
    let msgTxt = $$('message' + this.uid).getValue().replace(/(\r\n|\n|\r)/gm, "<br />")
    let message = messageSend.type ? '' : messageSend && !messageSend.includes('sendMsg') ? messageSend : msgTxt
    if ((message !== null && message !== '' && message !== '<br><br>') || messageSend.type) {
      let actors = []
      for (let i in data.actors) {
        if (data.actors[i].user.toString() !== context.user.toString()) {
          let actor = JSON.parse(JSON.stringify(data.actors[i]))
          actor.seen = '0'
          actors.push(actor)
        }
      }

      let msg = {
        message: message,
        actors: actors,
        date: new Date(),
        user: context.user,
        name: context.name
      }

      if (messageSend.type) {
        msg.type = messageSend.type
      }
      if (messageSend.fileId) {
        msg.fileId = messageSend.fileId
      }
      if (messageSend.fileName) {
        msg.fileName = messageSend.fileName
      }
      $$('chat' + context.user.toString()).add(msg)
      let row_id = $$('chat' + context.user.toString()).getLastId();
      $$('chat' + context.user.toString()).showItem(row_id);
      data = $$('formChat' + this.uid).getValues()
      let toActors = []
      let index = actors.findIndex((a) => {
        if (a.user.toString() !== context.user.toString()) {
          toActors.push(a.user.toString())
        }
      })
      this.app.socket.emit("chat message", { _id: data._id, chat: data, message: msg, to: toActors, from: context.user.toString(), fromName: context.name });
      $$('message' + this.uid).setValue('')
      var msg = document.getElementById('typing' + this.uid)
      msg.innerHTML = ""
      $$('message' + this.uid).focus()
    }
  }


}
