module.exports = {
    run: function (roomName) {
        let powerSpawn = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN
        })[0];

        if (powerSpawn.store[RESOURCE_ENERGY] >= 2000 && powerSpawn.store[RESOURCE_POWER >= 50]) {
            powerSpawn.processPower()
        }

        Game.powerCreeps['紫妈'].spawn(powerSpawn);

        let pc = Game.powerCreeps['紫妈'];

        if (pc.ticksToLive <= 100) {
            pc.say(`在 ${pc.ticksToLive} tick后死亡 `)
            if (pc.renew(powerSpawn) == ERR_NOT_IN_RANGE) {
                pc.moveTo(powerSpawn)
            }
        }



    }
}