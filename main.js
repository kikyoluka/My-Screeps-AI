const RoomConfig = require('roomConfig')

module.exports.loop = function () {
    require('prototype.Creep.move')
    require('creep.prototype')
    require('stateScanner').stateScanner()
    require('creep').CreepConfig.run()
    require('tower').TowerConfig.run()
    require('room').RoomConfig.run()
    require('pc').PcConfig.run()

    if (!Memory.RoomConfig) {
        Memory.RoomConfig = RoomConfig
    }

}