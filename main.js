const stateScanner = require('stateScanner.js')
require('prototype.Creep.move')


module.exports.loop = function () {
  stateScanner()
}