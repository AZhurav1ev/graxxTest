/*
 * froala integration
 */
/* global _froala _api FroalaEditor */
export const photo = {
  key: _froala,
  language: 'es',
  attribution: false,
  imageUploadURL: _api + 'user.image?=_id=',
  imageStyles: { rotar: 'Rotar imagen' },
  zIndex: 2501,
  toolbarInline: true,
  toolbarVisibleWithoutSelection: true,
  enter: FroalaEditor.ENTER_BR,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: ['fullscreen', 'undo', 'redo'],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const basic = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageStyles: {rotar: 'Rotar imagen'},
  imageManagerLoadURL: _api + 'file.list',
  fileUploadURL: _api + 'file.save',
  zindex: 2501,
  toolbarInline: true,
  toolbarVisibleWithoutSelection: true,
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: [
    'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'color', 'emoticons', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL',
    'indent', 'outdent', '-', 'insertImage', 'insertLink', 'insertFile', 'insertVideo', 'undo', 'redo', 'fontAwesome'
  ],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const normal = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  toolbarInline: false,
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: [
    'fullscreen', 'bold', 'italic', 'underline', 'color', 'align', 'formatOL', 'formatUL',
    'indent', 'outdent', 'insertImage', 'insertFile', 'insertTable', 'undo', 'redo'
  ],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const normal2 = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  toolbarInline: false,
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: [
  ],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const chat = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: 'Comentario...',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  enter: FroalaEditor.ENTER_BR,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  fontFamily: {
    'Arial,Helvetica,sans-serif': 'Arial',
    Calibri: 'Calibri',
    'Georgia,serif': 'Georgia',
    'Impact,Charcoal,sans-serif': 'Impact',
    'Tahoma,Geneva,sans-serif': 'Tahoma',
    'Times New Roman,Times,serif,-webkit-standard': 'Times New Roman',
    'Verdana,Geneva,sans-serif': 'Verdana'
  },
  zindex: 2501,
  toolbarInline: true,
  toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'color', '-', 'emoticons', 'insertImage', 'insertFile', 'insertVideo'],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const chat2 = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  toolbarBottom: true,
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'color', '-', 'emoticons', 'insertImage', 'insertFile', 'insertVideo'],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}

export const moreBasic = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: 'Escribe...',
  imageStyles: { rotar: 'Rotar imagen' },
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: [
    'bold', 'italic', 'underline', 'color', 'align', 'formatOL', 'formatUL',
    'indent', 'outdent', 'undo', 'redo'
  ],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000,
  quickInsertTags: [''],
  pluginsEnabled: [ 'link', "emoticons", "file", "fullscreen", "image", "imageManager", "url", 'insertVideo']
}

export const comment = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: 'Escribe...',
  imageStyles: { rotar: 'Rotar imagen' },
  enter: FroalaEditor.ENTER_BR,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  toolbarButtons: [
  ],
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000,
  quickInsertTags: [''],
  pluginsEnabled: [ 'link', "emoticons", "file", "fullscreen", "image", "imageManager", "url"]
}

export const full = {
  key: _froala,
  language: 'es',
  attribution: false,
  toolbarSticky: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  toolbarInline: false,
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  fontFamily: {
    'Arial,Helvetica,sans-serif': 'Arial',
    Calibri: 'Calibri',
    'Georgia,serif': 'Georgia',
    'Impact,Charcoal,sans-serif': 'Impact',
    'Tahoma,Geneva,sans-serif': 'Tahoma',
    'Times New Roman,Times,serif,-webkit-standard': 'Times New Roman',
    'Verdana,Geneva,sans-serif': 'Verdana'
  },
  tableStyles: {
    gpaxTable: _('withBorder')
  },
  inlineClasses: {
    check: 'Chequeado',
    correct: 'Verificado correcto',
    incorrect: 'Verificado incorrecto',
    notRated: 'No evaluado',
    notApply: 'No aplica',
    collated: 'Cotejado contra registros contables',
    reference: 'Referencia a papel de trabajo',
    sampling: 'Incluido en la muestra',
    byClient: 'Cédula preparada por el cliente'
  },
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}
export const inline = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  zindex: 2501,
  toolbarInline: true,
  toolbarVisibleWithoutSelection: true,
  enter: FroalaEditor.ENTER_BR,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}
export const dev = {
  key: _froala,
  language: 'es',
  attribution: false,
  placeholderText: '_',
  imageUploadURL: _api + 'file.save',
  imageManagerLoadURL: _api + 'file.list',
  imageStyles: {rotar: 'Rotar imagen'},
  fileUploadURL: _api + 'file.save',
  toolbarInline: false,
  enter: FroalaEditor.ENTER_BR,
  fontSize: ['8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '30', '60', '96'],
  tableResizerOffset: 10,
  tableResizingLimit: 50,
  fileMaxSize: 1024 * 1024 * 2000,
  videoMaxSize: 1024 * 1024 * 2000
}
