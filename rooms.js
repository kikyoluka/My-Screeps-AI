if (!Memory.roomConfig) {
    Memory.roomConfig = {}
}

if (!Memory.roomConfig.rooms) {
    Memory.roomConfig.rooms = ['E48S14', 'E49S14', 'E49S15', 'E49S16', 'E48S16', 'E47S16']
}

let myRooms = Memory.roomConfig.rooms
for (var name of myRooms) {
    !Memory.roomConfig.name ? Memory.roomConfig.name = {} : console.log('roomName is Already')

    !Memory.roomConfig.name.source0 ?
        { id: Game.rooms[name].find(FIND_SOURCES)[0].id } : console.log('source0 is Already')

    !Memory.roomConfig.name.source1 ?
        { id: Game.rooms[name].find(FIND_SOURCES)[1].id } : console.log('source1 is Already')

    if (!Memory.roomConfig.name.mineral) {
        let target = Game.rooms[name].find(FIND_MINERALS)[0]
        Memory.roomConfig.name.mineral = {
            id: target.id,
            type: target.mineralType
        }
    }

    !Memory.roomConfig.name.controller ?
        { id: Game.rooms[name].controller.id } : console.log('controller is Already')

    if (!Memory.roomConfig.name.factory) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_FACTORY
        })[0]

        Memory.roomConfig.name.factory = {
            id: target.id
        }
    }
    console.log('factory is Already')

    if (!Memory.roomConfig.name.storage) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_STORAGE
        })[0]

        Memory.roomConfig.name.storage = {
            id: target.id
        }
    }
    console.log('storage is Already')

    if (!Memory.roomConfig.name.terminal) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TERMINAL
        })[0]

        Memory.roomConfig.name.terminal = {
            id: target.id
        }
    }
    console.log('terminal is Already')

    if (!Memory.roomConfig.name.nuker) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_NUKER
        })[0]

        Memory.roomConfig.name.nuker = {
            id: target.id
        }
    }
    console.log('nuker is Already')

    if (!Memory.roomConfig.name.powerSpawn) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_POWER_SPAWN
        })[0]

        Memory.roomConfig.name.powerSpawn = {
            id: target.id
        }
    }
    console.log('powerSpawn is Already')

    if (!Memory.roomConfig.name.observer) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_OBSERVER
        })[0]

        Memory.roomConfig.name.observer = {
            id: target.id
        }
    }
    console.log('observer is Already')


    if (!Memory.roomConfig.name.centerLink) {
        let storages = Game.getObjectById(Game.rooms[name].storage.id)
        let target = storages.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_LINK
        })

        Memory.roomConfig.name.centerLink = {
            id: target.id
        }
    }
    console.log('centerLink is Already')

    if (!Memory.roomConfig.name.controllerLink) {
        let controllers = Game.rooms[name].controller
        let target = controllers.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_LINK
        })

        Memory.roomConfig.name.controllerLink = {
            id: target.id
        }
    }
    console.log('controllerLink is Already')

    if (!Memory.roomConfig.name.labs) {
        let flags = Game.flags[name]
        let labs = flags.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_LAB
        })

        Memory.roomConfig.name.labs = {
            lab1: {
                id: labs[0].id
            },
            lab6: {
                id: labs[1].id
            },
            boost: {
                status: false,
                target: '',
                labName: ''
            }
        }
    }
    console.log('labs is Already')

    if (!Memory.roomConfig.name.spawnList) {
        Memory.roomConfig.name.spawnList = {
            harvester: { count: 0 },
            filler: { count: 0 },
            upgrader: { count: 0 },
            builder: { count: 0 },
            transfer: { count: 0 },
            centerFiller: { count: 0 },
            repair: { count: 0 }
        }
    }
    console.log('spawnList is Already')

    if (!Memory.roomConfig.name.searchTower) {
        let target = Game.rooms[name].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        })[0]

        Memory.roomConfig.name.searchTower = {
            id: target.id
        }
    }
    console.log('searchTower is Already')

    if (!Memory.roomConfig.name.powerBank) {
        Memory.roomConfig.name.powerBank = {
            roomName: '', id: '', status: false,
            count: {
                attacker: 0,
                healer: 0,
                transfer: 0
            },
            run: {
                attack: false,
                heal: false,
                transfer: false,
                ready: false
            }
        }
    }
    console.log('powerBank is Already')

    if (!Memory.roomConfig.name.deposit) {
        Memory.roomConfig.name.deposit = {
            roomName: '',
            id: '',
            type: '',
            status: false
        }
    }
    console.log('deposit is Already')

    !Memory.roomConfig.name.war ?
        Memory.roomConfig.name.war = false : console.log('war is Already')

    !Memory.roomConfig.name.fastRepair ?
        Memory.roomConfig.name.fastRepair = false : console.log('fastRepair is Already')
}


