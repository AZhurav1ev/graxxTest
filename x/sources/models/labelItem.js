export const labelItem = function (label, cl) {
  return { view: 'label', relative: true, autoheight: true, template: '<span class="' + cl + '" style="color: #fff; display: inline-block; margin-left: 15px;  margin-top: 15px; padding-left: 7px; padding-right: 7px; font-weight: bold; font-size: 15px; border-radius: 5px;">' + _(label) + '</span>' }
}
