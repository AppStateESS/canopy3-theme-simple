'use strict'
/* global $, jQuery */
import 'bootstrap'
import '@fortawesome/fontawesome-free'
import '@fortawesome/fontawesome-free/js/all.js'
jQuery.fn.load = function (callback) {
  $(window).on('load', callback)
}
