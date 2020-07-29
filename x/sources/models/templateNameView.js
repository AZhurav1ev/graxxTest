export const template = function (name) {
  name = name || '&nbsp;'
  name = name.replace(/(<([^>]+)>)/g, '')
  var shortName = name
  if (shortName.length > 25) {
    shortName = shortName.substring(0, 25) + '...'
  }
  return {
    view: 'template',
    relative: true,
    css: 'webix_clean',
    height: 30,
    borderless: true,
    template: "<div title='" + name + "' style='text-align:center;color: black; font-weight: bold;font-size: 17px; padding-left: 10px;'>" + shortName + '</div>'
  }
}
