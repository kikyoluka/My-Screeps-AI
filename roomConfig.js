Memory.roomConfig = {
    myRoom: ['E48S14', 'E49S14', 'E49S15', 'E49S16', 'E48S16', 'E47S16'],
    E48S14: {
        Source0: { x: 26, y: 10, id: '5bbcafe39099fc012e63b575' },
        Source1: { x: 24, y: 10, id: '5bbcafe39099fc012e63b574' },
        Mineral: { x: 30, y: 2, id: '5bbcb6a6d867df5e54207a63', type: 'K' },
        Controller: { x: 23, y: 31, id: '5bbcafe39099fc012e63b576' },
        Factory: { x: 27, y: 17, id: '5e7cf298427ea0ad538dd1d6' },
        Storage: { x: 23, y: 18, id: '5e5e4c26cfa64f255674fc3f', overflow: false },
        Terminal: { x: 0, y: 0, id: '', overflow: false },
        Nuker: { x: 27, y: 27, id: '5eaf9e20d3e10b483c3a1514' },
        PowerSpawn: { x: 29, y: 27, id: '5eaf0d2abc7fd323f0f5355f' },
        Observer: { x: 30, y: 27, id: '5eae7b43676028e1e63bdfc7' },
        Centerlink: { x: 21, y: 20, id: '5e700baae70288d2beb0d06d' },
        Controllerlink: { x: 28, y: 29, id: '5e842aa8662e56c3e69fd26e' },
        Labs: {
            lab1: { x: 0, y: 0, id: '' },
            lab6: { x: 0, y: 0, id: '' },
            boost: { status: false, target: '', labName: '' }
        },
        Spawnlist: {
            harvester: { count: 0, memory: roleHarvester },
            filler: { count: 0, memory: roleFillter },
            upgrader: { count: 0, memory: roleUpgrader },
            builder: { count: 0, memory: roleBuilder },
            transfer: { count: 0, memory: roleTransfer },
            centerFiller: { count: 0, memory: roleCenterFiller },
            repair: { count: 0, memory: roleRepair }
        },
        searchTower: { x: 0, y: 0, id: '' },
        powerBanks: {
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
        },
        deposits: {
            roomName: '',
            id: '',
            type: '',
            status: false
        },
        war: false,
        fastRepair: false
    }
};


module.exports = Memory.roomConfig