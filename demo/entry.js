require('bootstrap/dist/css/bootstrap.css')
require('../expandable-input.css')
require('./demo.css')

var jQuery = require('jquery')
var expandableInput = require('../expandable-input')

expandableInput(jQuery)

window.$ = window.jQuery = jQuery
