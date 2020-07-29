/* global webix $$ _api download FroalaEditor Tribute _froala */
/*
 * froala integration
 */
import * as Froala from 'helpers/froala.config'
webix.protoUI({
  name: 'froala',
  $init: function (config) {
    this._waitEditor = webix.promise.defer()
    if (!config.config) {
      config.config = Froala.full
    } else if (typeof config.config === 'string') {
      config.config=Froala[config.config] || Froala.full
    }
    webix.delay(this._init_froala, this)
  },
  setFocus () {
    webix.delay(() => {
      this._froala.events.focus()
    }, this, [], 50)
  },
  _init_froala: function () {
    if (this._froala) {
      this._froala.destroy()
    }
    var height = this.$height
    if (this.config.config) {
      this.config.config = JSON.parse(JSON.stringify(this.config.config))
    }
    this._height = height
    if (!this.config.config.toolbarInline) {
      height -= 50
    }
    if (this.config.placeholder) {
      this.config.config.placeholderText = this.config.placeholder
    } else if (this.config.label) {
      this.config.config.placeholderText = this.config.label
    }
    this.config.config.language = webix.storage.local.get('lang').split('-')[0]
    this.uid = webix.uid()
    this
    let events = {
      contentChanged: this.onChange,
      initialized: webix.bind(this.onInit, this),
      // next is for control fullscreen the froala editor
      'commands.before': webix.bind(this.onClick, this),
      'images.click': webix.bind(this.onClick, this),
      'html.set': () => {
        if (this.config.readonly) {
          this._froala.edit.off()
        }
      }
    }
    if (this.config.contentChanged) {
      events.contentChanged = this.config.contentChanged
    }
    this.config.config.events = events
    // next is for control fullscreen when froala editor it are disable (edit.off)
    this.$view.addEventListener('click', webix.bind(this.onClick, this))
    if (this.config.height) {
      this.$view.style.overflow = 'auto'
    } else {
      this.config.config.height = height
    }
    this.config.config.linkAutoPrefix = ''
    this.config.config.toolbarSticky = false
    this.config.config.key = _froala
    this._froala = new FroalaEditor(this.$view, this.config.config)
    this._froala.parent = this
    this._froala.el.setAttribute('id', 'fredit' + this.uid)
    this._waitEditor.resolve(this._froala)
    if (this.config.value) {
      this.setValue(this.config.value)
    }
    if (this._focus_await) { this.focus() }
    this._updateScrollSize()
  },
  onInit () {
    var mentions = []
    if (this.config.addReviser !== false) {
      var url = _api + 'params.userFroala?limit=50'
      if (this.config.signature) url += '&signature=1&key='
      else url += '&key='
      mentions.push({
        trigger: '@', // users
        lookup: 'value',
        requireLeadingSpace: true,
        menuContainer: document.body,
        fillAttr: 'value',
        selectTemplate: function (obj) {
          if (obj.original.signature && obj.original.signature.length > 3) {
            return '<span class=\'h-card p-name\'><a onclick=\'return false;\' class=\'u-uid\' href=\'' + obj.original.id + '\'>' + obj.original.signature + '</a></span>'
          } else {
            return '<span class=\'h-card p-name\'><a onclick=\'return false;\' class=\'u-uid\' href=\'' + obj.original.id + '\'>' + obj.original.value + '</a></span>'
          }
        },
        values: function (query, next) {
          webix.ajax(url + query).then((data) => {
            next(data.json())
          })
        }
      })
    }
    var project = this.$scope && this.$scope.getParam ? this.$scope.getParam('project', true) : ''
    let urlDocs
    if (project) urlDocs = _api + 'params.options?name=document&project=' + project
    else { urlDocs = _api + 'params.options?name=document' }
    urlDocs += '&limit=50&key='
    mentions.push({
      trigger: '#', // work papers of projects
      requireLeadingSpace: true,
      lookup: 'value',
      menuContainer: document.body,
      selectTemplate: function (obj) {
        return '<span class=\'h-entry p-name\'><a class=\'u-uid\' href=\'' + obj.original.id + '\' style=\'display:none\'/><a class=\'u-url\' href=\'' + obj.original.path + '?_id=' + obj.original.id + '\'>' + obj.original.value + '</a></span>'
      },
      values: function (query, next) {
        webix.ajax(urlDocs + query).then((data) => {
          next(data.json())
        })
      }
    })
    const urlNoteAndAttac = _api + 'params.options?name=noteAndAttac&limit=50&key='
    mentions.push({
      trigger: 'PP', // notes and attachments
      requireLeadingSpace: true,
      lookup: 'value',
      selectTemplate: function (obj) {
        return '<span class=\'h-entry p-name\'><a class=\'u-uid\' href=\'' + obj.original.id + '\' style=\'display:none\'/><a class=\'u-url\' href=\'' + obj.original.path + '?_id=' + obj.original.id + '\'>' + obj.original.value + '</a></span>'
      },
      menuContainer: document.body,
      fillAttr: 'value',
      values: function (query, next) {
        webix.ajax(urlNoteAndAttac + query).then((data) => {
          next(data.json())
        })
      }
    })
    mentions.push({
      trigger: '!', // notes and attachments
      requireLeadingSpace: true,
      lookup: 'value',
      selectTemplate: function (obj) {
        return '<span class=\'h-entry p-name\'><a class=\'u-uid\' href=\'' + obj.original.id + '\' style=\'display:none\'/><a class=\'u-url\' href=\'' + obj.original.path + '?_id=' + obj.original.id + '\'>' + obj.original.value + '</a></span>'
      },
      menuContainer: document.body,
      fillAttr: 'value',
      values: function (query, next) {
        webix.ajax(urlNoteAndAttac + query).then((data) => {
          next(data.json())
        })
      }
    })
    const urlRiskAssessments = _api + 'params.options?name=riskAssessment&limit=50&key='
    mentions.push({
      trigger: '?', // risk assessment
      requireLeadingSpace: true,
      lookup: 'value',
      selectTemplate: function (obj) {
        return '<span class="h-entry p-name"><a class="u-uid" href="' + obj.original.id + '">' + obj.original.value + '</a></span > '
      },
      values: function (query, next) {
        webix.ajax(urlRiskAssessments + query).then((data) => {
          next(data.json())
        })
      }
    })
    const urlUnits = _api + 'params.options?name=unit&limit=50&key='
    mentions.push({
      trigger: '&', // admin units
      requireLeadingSpace: true,
      lookup: 'value',
      selectTemplate: function (obj) {
        return '<span class="h-entry p-name"><a class="u-uid" href="' + obj.original.id + '">' + obj.original.value + '</a></span > '
      },
      values: function (query, next) {
        webix.ajax(urlUnits + query).then((data) => {
          next(data.json())
        })
      }
    })
    const urlRepos = _api + 'params.options?name=repository&limit=50&key='
    mentions.push({
      trigger: '%', // repository links
      requireLeadingSpace: true,
      lookup: 'value',
      selectTemplate: function (obj) {
        return '<span class=\'h-entry p-name\'><a class=\'u-uid\' href=\'' + obj.original.id + '\' style=\'display:none\'/><a class=\'u-url\' href=\'' + obj.original.path + '?_id=' + obj.original.id + '\'>' + obj.original.value + '</a></span>'
      },
      values: function (query, next) {
        webix.ajax(urlRepos + query).then((data) => {
          next(data.json())
        })
      }
    })
    if (project) {
      const urlFiles = _api + 'params.options?name=files&project=' + project + '&limit=50&key='
      mentions.push({
        trigger: '*', // files
        requireLeadingSpace: true,
        lookup: 'value',
        selectTemplate: function (obj) {
          return '<a class="fr-file" href="' + obj.original.id + '" target="_blank">' + obj.original.value + '</a>'
        },
        values: function (query, next) {
          webix.ajax(urlFiles + query).then((data) => {
            next(data.json())
          })
        }
      })
    }
    this.tribute = new Tribute({ collection: mentions })
    this.tribute.attach(this._froala.el)
    this._froala.events.on('keydown', (e) => {
      if (e.which === FroalaEditor.KEYCODE.ENTER && this.tribute.isActive) {
        return false
      }
    }, true)
  },
  onClick (cmd) {
    // toolbar fullscreen button or click with alt key pressed
    if (cmd === 'fullscreen' || (cmd.type && cmd.type === 'click' && cmd.altKey)) {
      if (this._froala.fullscreen.isActive()) {
        this.$view.style.height = this._height + 'px'
      } else {
        this.$view.style.height = '100%'
      }
      if (cmd !== 'fullscreen') {
        this._froala.fullscreen.toggle()
      }
    }
    /* if (cmd.type === 'click') {
      var href = cmd.target.attributes.href ? cmd.target.attributes.href.value : ''
      if (!href && cmd.target.tagName === 'IMG') {
        href = cmd.target.parentElement.href ? cmd.target.parentElement.href : ''
      }
      if (this.config.readonly && href) {
        cmd.preventDefault()
        cmd.stopPropagation()
        if (!href.includes('file.get')) {
          href = href.split('/')
          href = href[href.length - 1]
          var id, name
          // problema Hipotecario
          if (href.includes('_Id=')) {
            id = href.split('_Id=')[1].split('&')[0]
            name = href.split('?_Id=')[0].split('.')[1]
          } else {
            id = href.split('_id=')[1].split('&')[0]
            name = href.split('?_id=')[0].split('.')[1]
          }
          if (this.$scope && this.$scope.getParam) {
            var project = this.$scope.getParam('project', true)
            var task = this.$scope.getParam('task', true)
            href += (project ? '&project=' + project : '') + (task ? '&task=' + task : '')
          }
          this.$scope.app.multiShow(href, id)
        } else {
          this.getFile(href)
          // this.download(href)
        }
        return false
      }
    }*/
    if (cmd === 'linkOpen') {
      let href = this._froala.link.get().href
      if (href.includes('file.get?_id=')) {
          this.$scope.app.getFile(cmd, this._froala.link.get())
        } else if (href.includes('?_id=')) {
          let path
          for (let a in this._froala.link.get().attributes) {
            if (this._froala.link.get().attributes[a].name === 'href') {
              path = this._froala.link.get().attributes[a].value
            }
          }
          let y = path
          let i = y.indexOf('=')
          let fileId = y.substring(i + 1)
          this.$scope.app.multiShow(path, fileId)
        } else {
          window.open(href, '_self')
        }
      return false
    }
  },
  putAttachFields () {
    if (this._froala && this.config.attachFields) {
      var params = {}
      for (const field in this.config.attachFields) {
        params[field] = this.config.attachFields[field]
      }
      this._froala.opts.fileUploadParams = params
      this._froala.opts.imageUploadParams = params
    }
  },
  readonly () {
    if (this._froala.edit) this._froala.edit.off()
    this._froala.$el[0].className = this._froala.$el[0].className.replace('fr-disabled', '')
    var imgs = this.$view.getElementsByTagName('IMG')
    if (imgs.length > 0) {
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].onclick = webix.bind(this.onClick, this)
      }
    }
  },
  refresh () {
    if (this.config.readonly) {
      if (this._froala) {
        this.readonly()
      }
    } else if (!this._froala) {
      if (this.config.height || this.config.height === 0) {
        this.$view.style.overflow = 'auto'
      }
      this.config.config.linkAutoPrefix = ''
      this._froala = new FroalaEditor(this.$view, this.config.config)
      this._waitEditor.resolve(this._froala)
      if (this.config.value) {
        this.setValue(this.config.value)
      }
      if (this._focus_await) { this.focus() }
      this._updateScrollSize()
    } else {
      this._froala.size.refresh()
    }
  },
  onChange () {
    var config = this.parent.config
    if (config.form && $$(config.form)) { $$(config.form).callEvent('onChange', [config.name, this.parent.getValue()]) }
  },
  focus () {
    if (this._froala) {
      this._froala.events.focus()
    }
  },
  _updateScrollSize () {
    const box = $$(this.$view)
    if (!box.style) box.style = {}
    box.style.height = '100%'
    box.style.width = (this.$width || 0) + 'px'
  },
  setActors (content, role, value) {
    var template = document.createElement('template')
    var html = content.trim() // Never return a text node of whitespace as the result
    template.innerHTML = html
    const roleElement = template.content.getElementById(role)
    if (roleElement) {
      if (typeof value === 'string') { roleElement.innerHTML = value } else {
        let field = ''
        for (const i in value) {
          field += value[i].signature ? value[i].signature : value[i].name
          field += '<br>'
        }
        roleElement.innerHTML = field
      }
      this._froala.html.set(template.innerHTML)
      this.config.value = template.innerHTML
    }
  },
  setValue (value) {
    if (value.indexOf('<base href="') === -1) {
      value = '<base href="' + _host + '">' + value
    } else if (value.indexOf('<base href="') !== -1) {
      let i = value.indexOf('<base href="')
      let res = value.substr(i)
      let f = res.indexOf('">')
      let base = value.substr(i, f + 1)
      let iHost = base.indexOf('"')
      let sub = base.substr(iHost + 1)
      let fHost = sub.indexOf('"')
      let host = base.substr(iHost + 1, fHost + 1)
      if (host !== '') {
        value = value.replace(host, _host)
      }
    }
    this.config.value = value
    if (this._froala) {
      if (this._froala.html) this._froala.html.set(value)
      if (this.config.docId) this._froala.opts.imageUploadParams = { _id: this.config.docId }
      if (this.config.readonly === true) {
        this.readonly()
      }
    } else {
      this.$view.innerHTML = value
    }
  },
  getValue () {
    var r = ''
    try {
      if (this._froala) r = this._froala.html.get(true)
      else r = this.config.value
    } catch (e) {
      webix.message(e)
    }
    return r
  },
  getEditor (waitEditor) {
    return waitEditor ? this._waitEditor : this._froala
  },
  // undo, redo, etc
  undo () {
    this._froala.undo()
  },
  redo () {
    this._froala.redo()
  },
  undoLength () {
    return this._froala.historySize().undo
  }
}, webix.ui.view)
