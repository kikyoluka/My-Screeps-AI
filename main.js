require('prototype.Creep.move')
require('roomConfig')
require('creep.prototype')

module.exports.loop = function () {
  require('stateScanner').stateScanner()
  require('creep').CreepConfig.run()
  require('tower').TowerConfig.run()
  require('room').RoomConfig.run()
  require('pc').PcConfig.run()
}