import { JetView } from 'webix-jet'

export default class Login extends JetView {
  config () {
    return {
      css: {
        'background-image': 'url("img/login.png")',
        'background-repeat': 'no-repeat',
        'background-size': 'cover'
      },
      rows: [
        {
          height: window.innerHeight / 3,
          rows: [
            { height: 50 },
            { cols: [{}, { view: 'template', borderless: true, width: 260, css: 'transparent', template: '<img src="img/logoGPAX.svg" />' }, {}] },
            { minheight: 20, height: 30 }
          ]
        },
        {
          cols: [
            { width: 30 },
            {
              view: 'form',
              id: 'flogin',
              borderless: true,
              css: 'transparent',
              elements: [
                { view: 'text', name: 'login', placeholder: _('email'), height: 50 },
                { height: 20 },
                { view: 'text', type: 'password', name: 'password', placeholder: _('password'), height: 50 },
                {
                },
                { view: 'button', label: _('login'), height: 60, click: webix.bind(this.doLogin, this) }
              ]
            },
            { width: 30 }
          ]
        },
        { height: 100 }
      ]
    }
  }

  doLogin () {
    const form = $$('flogin')
    if (form.validate() && !form.inProcess) {
      form.inProcess = 1
      const data = form.getValues()
      const user = this.app.getService('user')
      user.login(data.login, data.password).catch(() => {
        delete form.inProcess
        webix.message(_('invalidCredentials'), 'error')
      })
    }
  }
}
