const labCtrl = require('labCtrl')

module.exports.loop = function () {
    require('prototype.Creep.move')
    require('creep.prototype')
    require('stateScanner').stateScanner()
    require('roomConfig').run()
    require('creep').CreepConfig.run()
    require('tower').TowerConfig.run()
    require('room').RoomConfig.run()
    require('pc').PcConfig.run()


    if (!Memory.RoomConfig) {
        Memory.RoomConfig = RoomConfig
    }

    labCtrl.run('E49S15', RESOURCE_GHODIUM, 2000)
}