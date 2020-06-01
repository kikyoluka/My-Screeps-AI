function labReactor (roomName) {
    let lab1 = Game.getObjectById(Memory.roomConfig[roomName].Labs.lab1.id)
    let lab6 = Game.getObjectById(Memory.roomConfig[roomName].Labs.lab6.id)
    let labs = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: (s) => {
            return (
                s.structureType == STRUCTURE_LAB &&
                s.id !== lab1.id &&
                s.id !== lab6.id
            )
        }
    })

    let lab1s = []
    let lab6s = []
    for (var i = 0; i < labs.length; i++) {
        if (labs[i].inRangeTo(lab1, 2)) {
            lab1s.push(labs[i])
        }

        if (labs[i].inRangeTo(lab6, 2)) {
            lab6s.push(labs[i])
        }
    }

    for (var j = 0; j < lab1s.length; j++) {
        lab1.runReaction(lab1s[j], lab1s[j + 1])
        lab6.runReaction(lab6s[j], lab6s[j + 1])
    }
}

function CreepBoost (creep) {
    if (creep.memory.needBoost) {
        if (lab1.boostCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(lab1)
        }
    }
}


module.exports = {
    LabReaction,
    CreepBoost
}

