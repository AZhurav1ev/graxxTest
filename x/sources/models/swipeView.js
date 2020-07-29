export const swipe = function (view, valueThis) {
  return {
        css: {
          'z-index': '9999'
        },
        top: 0,
        left: 0,
        width: valueThis._parent._root.$width,
        rows: [
          {
            id: "menu" + valueThis.uid,
            hidden: true,
            rows: [view]
          },
          { 
            css: {
              'margin-left': (valueThis._parent._root.$width - valueThis._parent._root.$width / 7) + 'px !important'
            },
            cols: [
              {
                view: 'button',
                id: 'btnDetails' + valueThis.uid,
                type: 'iconTop',
                icon: 'mdi mdi-gesture-swipe-down',
                on: {
                  onTouchMove: webix.bind(swipeDetails, valueThis)
                },
                css: 'swipeButton',
                height: 45,
                width: 40,
                tooltip: _('details'),
                click: webix.bind(animation, valueThis)
              }
            ]
          }
        ]
      }
}

function swipeDetails (sc1, cc2) {
                  let menuAttacheds = $$('menu' + this.uid)
                  //$$("menu" + this.uid).define("height", cc2.y)
                  let top = cc2.y - 30
                  let bottom = this._root.$height - top
                  let x = document.getElementsByClassName($$('btnDetails' + this.uid).data.css)
                  if (top > -3 && bottom > 120) {
                    $$("menu" + this.uid).define('height', top || 1)
                    $$("menu" + this.uid).resize()
                    x[0].style.top = top + 'px'
                    if (menuAttacheds.config.hidden) {
                      menuAttacheds.show()
                    }
                  } else if(top < -3) {
                    x[0].style.top = '-3px'
                    if (!menuAttacheds.config.hidden) {
                      menuAttacheds.hide()
                    }
                  } else if(bottom < 120) {
                     $$("menu" + this.uid).define('height', this._root.$height - 120)
                     $$("menu" + this.uid).resize()
                     x[0].style.top = this._root.$height - 120 + 'px'
                      if (menuAttacheds.config.hidden) {
                        menuAttacheds.show()
                      }
                  }
                }

  function animation () {
    if ($$("menu" + this.uid).config.height < 10) {
      var start = null;
      let x = document.getElementsByClassName($$('btnDetails' + this.uid).data.css)
      let idInter = (timestamp) => {
        if (!start) start = timestamp
        var progress = timestamp - start
        progress = progress || 1
        var min = Math.min(progress / 2, this._parent._root.$height)
        if (min < this._parent._root.$height / 2) {
          x[0].style.top = min + 'px'
          $$("menu" + this.uid).define('height', min)
          $$("menu" + this.uid).resize()
          $$("menu" + this.uid).show()
          window.requestAnimationFrame(idInter)
        }
      }
      window.requestAnimationFrame(idInter)
    }else {
      let height = $$("menu" + this.uid).config.height
      let x = document.getElementsByClassName($$('btnDetails' + this.uid).data.css)
      let idInter = (timestamp) => {
        height = height - 10
        if (height > 0) {
          x[0].style.top = height + 'px'
          $$("menu" + this.uid).define('height', height)
          $$("menu" + this.uid).resize()
          $$("menu" + this.uid).show()
          window.requestAnimationFrame(idInter)
        } else {
          x[0].style.top = 0 + 'px'
          $$("menu" + this.uid).define('height', 1)
          $$("menu" + this.uid).hide()
        }
      }
      window.requestAnimationFrame(idInter)
    }
  }