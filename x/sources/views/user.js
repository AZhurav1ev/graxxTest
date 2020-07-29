/* global webix _ _api $$ moment */
import { JetView } from 'webix-jet'
import { template } from 'models/templateNameView'
import 'helpers/stats'
import 'helpers/password'
import { tags } from 'helpers/tags'
export default class user extends JetView {
  config() {
    var id = this.getParam('_id', true)
    return webix.ajax(_api + 'user.get?_id=' + id).then(data => {
      const doc = data.json()
      /// /-------->> calcular data para pintar la vista ------------

      var context = this.app.getService('user').getUser()
      this._derty = false
      this.uid = '.' + webix.uid()
      this.uploader = webix.ui({
        id: 'uploadAPI',
        view: 'uploader',
        name: 'uploader',
        upload: _api + 'user.setImage?_id=' + id,
        autosend: true,
        on: {
          onFileUpload: () => {
            var photo = $$('photo' + id)
            photo.config.image = photo.config.image + '&x=' + Math.random()
            photo.refresh()
          },
          onFileUploadError: function () {
            webix.alert('Error during file upload')
          }
        },
        apiOnly: true
      })
      var elementsContent = []
      elementsContent.push({
        cols: [
          {
            view: 'button',
            name: 'photo',
            type: 'image',
            css: 'toolbarButton',
            image: _api + 'user.image?size=100&_id=' + id,
            id: 'photo' + id,
            width: 100,
            height: 100,
            click: webix.bind(this.photo, this)
          },
          { width: 1 },
          {
            rows: [
              { view: 'text', name: tags.name, id: 'name' + this.uid, placeholder: _('name'), required: true },
              { view: 'text', name: 'userId', id: 'userId' + this.uid, placeholder: _('identification') }
            ]
          }
        ]
      })
      elementsContent.push({ view: 'text', name: tags.email, id: 'email' + this.uid, placeholder: _('email'), required: true })
      elementsContent.push({ view: 'text', name: 'phone', id: 'phone' + this.uid, placeholder: _('phone') })
      elementsContent.push({ view: 'text', name: 'login', id: 'login' + this.uid, placeholder: _('userCode'), required: true })
      elementsContent.push({
        view: 'password',
        name: 'password',
        id: 'password' + this.uid,
        placeholder: _('password'),
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
      })
      elementsContent.push({
        view: 'password',
        name: tags.repeatPassword,
        id: 'repeatPassword' + this.uid,
        placeholder: _('repeatPassword'),
        on: {
          onChange: webix.bind(function (newv) {
            var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
            var valid = newv.length === 0 || regex.test(newv)
            if (!valid) {
              webix.message(_('invalidPassword'), 'error', 3000)
              this.validate = false
            } else {
              this.validate = true
              var values = $$('fuser' + this.uid).getValues()
              if (values.password !== values.repeatPassword) {
                webix.message(_('differentPassword'), 'error', 3000)
              }
            }
          }, this)
        },
        validate: function (newv) {
          var regex = new RegExp('^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$', 'g')
          var valid = newv.length === 0 || regex.test(newv)
          if (valid) {
            if ($$('password' + this.uid).getValue() !== $$('repeatPassword' + this.uid).getValue()) {
              return false
            } else {
              return true
            }
          } else {
            return valid
          }
        }
      })
      elementsContent.push({})

      // ------------------------->>
      /// ////////////////////////////////////////////////////
      var formContent = {
        margin: 0,
        relative: true,
        padding: 0,
        view: 'form',
        id: 'fuser' + this.uid,
        complexData: true,
        autoheight: true,
        on: {
          onChange: () => { this._derty = true }
        },
        data: doc,
        elementsConfig: {
          labelPosition: 'top',
          margin: 3,
          invalidMessage: _('invalid')
        },
        elements: elementsContent
      }

      return {
        rows: [
          template(_('user')),
          {
            view: 'abslayout',
            rows: [
              formContent
            ]
          },
          {
            view: 'toolbar',
            relative: true,
            cols: [
              {},
              {
                view: 'button',
                icon: 'mdi mdi-content-save',
                type: 'iconTop',
                width: 40,
                css: 'toolbarButton',
                height: 40,
                click: webix.bind(this.save, this)
              }
            ]
          }
        ]
      }
    })
  }

  photo() {
    if (this.uploader) {
      var id = $$('fuser' + this.uid).getValues()._id
      this.uploader.fileDialog({ id: id })
    }
  }

  save() {
    var form = $$('fuser' + this.uid)
    if (!$$('email' + this.uid).validate() || !$$('name' + this.uid).validate() || !$$('login' + this.uid).validate()) {
      this.validate = false
    } else {
      this.validate = true
    }
    var values = form.getValues()
    var pass1 = values.password || ''
    var pass2 = values.repeatPassword || ''
    if (this.validate && pass1 === pass2) {
      webix.ajax().post(_api + 'user.save', values).then((res) => {
        webix.message(_('savedChanges'), 'info')
        $$('fuser' + this.uid).$scope._derty = false
      })
    } else {
      if (pass1 !== pass2) {
        webix.message(_('differentPassword'), 'info')
      } else {
        webix.message(_('invalidForm'), 'error')
      }
    }
  }
}
