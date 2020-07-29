export const templateStatus = function (status) {
  return { view: 'label', relative: true, height: 30, template: '<span style=" position: absolute; padding: 5px; top: 0px; text-align: center;  height:100%; width:100%; color: white; font: 700 18px/1 Lato, sans-serif;text-shadow: 0 1px 1px rgba(0,0,0,.2); text-transform: uppercase;" class="' + status + '">' + _(status) + '</span>' }
}
