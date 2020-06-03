const labCtrl = require('labCtrl')

module.exports.loop = function () {
    require('prototype.Creep.move')
    require('creep.prototype')
    require('stateScanner').stateScanner()
    require('roomConfig').run()
    require('pcConfig').work()
    require('tower').run()
    require('room').run()
    require('creep').CreepConfig._run()

    labCtrl.run('E49S15', RESOURCE_GHODIUM, 2000)
}