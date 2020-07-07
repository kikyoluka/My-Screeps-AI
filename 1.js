
/* creep配置 */
module.exports = {
    _run: function () {
        for (var i in Game.creeps) {
            var creep = Game.creeps[i]
            switch (creep.memory.roleName) {
                case 'roleUpgrader':
                    this._upgrad(creep)
                    break;
                case 'roleFiller':
                    this._fill(creep)
                    break;
                case 'roleBuilder':
                    this._build(creep)
                    break;
                case 'roleHarvest':
                    this._harvest(creep)
                    break;
                case 'roleTransfer':
                    this._transfer(creep)
            }
        }

        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    /**
     * 基础建筑填充单位
     * @param {Object} creep 
     */
    _fill: function (creep) {
        let fillTargets;
        let sourceTarget;
        if (!fillTargets) {
            fillTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (
                        s.structureType == STRUCTURE_SPAWN && s.store[RESOURCE_ENERGY] < 300 ||
                        s.structureType == STRUCTURE_EXTENSION && s.store[RESOURCE_ENERGY] < 50 ||
                        s.structureType == STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] < 600
                    )
                }
            })
        }

        if (!creep.memory.targetId) {
            let target = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            })[0]

            creep.memory.targetId = target.id
        } else {
            sourceTarget = Game.getObjectById(creep.memory.targetId)
        }

        if (fillTargets.length > 0) {
            creep.memory.fillStatus = true
        } else {
            creep.memory.fillStatus = false
        }

        /* 填充基础建筑 */
        if (creep.memory.fillStatus && sourceTarget) {
            if (creep.store[RESOURCE_ENERGY] == 0) {
                if (creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sourceTarget)
                }
            } else if (creep.transfer(fillTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(fillTargets[0])
            }
        }

        if (creep.ticksToLive <= 10) {
            Memory[creep.room.name].spawnList.filler.count = 0
        }
    },

    /**
     * 升级单位
     * @param {Object} creep 
     */
    _upgrad: function (creep) {
        /* 枢纽升级 */
        let upTarget = creep.room.controller
        let sourceTarget;
        if (!creep.memory.targetId) {
            let target = upTarget.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            })

            creep.memory.targetId = target.id
        } else {
            sourceTarget = Game.getObjectById(creep.memory.targetId)
        }

        if (creep.store[RESOURCE_ENERGY] == 0 && sourceTarget) {
            if (creep.withdraw(sourceTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceTarget)
            }
        } else if (creep.upgradeController(upTarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(upTarget)
        }
    },


    /**
     * 建造单位
     * @param {Object} creep 
     */
    _build: function (creep) {
        let repairTargets;
        let buildTarget;
        let storages;
        let resouces;

        if (!buildTarget) {
            buildTarget = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES)
        }

        if (!storages) {
            storages = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            })[0]
        }

        if (!repairTargets) {
            repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (
                        s.hits < s.hitsMax * 0.5 &&
                        s.structureType !== STRUCTURE_WALL &&
                        s.structureType !== STRUCTURE_RAMPART
                    )
                }
            })
        }

        if (!resouces) {
            resouces = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (s) => s.amount >= 200 && s.resourceType == RESOURCE_ENERGY
            })
        }

        if (creep.store[RESOURCE_ENERGY] == creep.store.getCapacity()) {
            creep.memory.status = true
        }

        if (creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.status = false
        }

        if (!buildTarget) {
            creep.memory.buildStatus = false
        }

        if (!creep.memory.status) {
            if (resouces) {
                if (creep.pickup(resouces, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resouces)
                }
            } else if (creep.withdraw(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storages)
            }
        } else if (buildTarget) {
            if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(buildTarget)
            }
        }

        if (!creep.memory.buildStatus) {
            if (repairTargets) {
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0])
                }
            }
        }
    },

    /**
     * 采矿单位
     * @param {object} creep 
     */
    _harvest: function (creep) {
        if (!creep.memory.sourceId) {
            let sources = creep.room.find(FIND_SOURCES)
            if (creep.memory.target == 's0') {
                creep.memory.sourceId = sources[0].id
            } else {
                creep.memory.sourceId = sources[1].id
            }
        }

        let target = Game.getObjectById(creep.memory.sourceId)
        if (target) {
            if (!creep.memory.containerId) {
                let containers = target.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                })

                creep.memory.containerId = containers.id
            }


            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
            else {
                let targets = Game.getObjectById(creep.memory.containerId)
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets)
                }
            }
        }
    },

    _transfer: function (creep) {
        if (!creep.memory.sourceTarget0Id || !creep.memory.sourceTarget1Id || creep.memory.targetId) {
            let sources = creep.room.find(FIND_SOURCES)
            let target0 = sources[0].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            })

            let target1 = sources[1].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            })

            let roomController = Game.rooms[creep.room.name].controller
            let target = roomController.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            })

            creep.memory.sourceTarget0Id = target0.id
            creep.memory.sourceTarget1Id = target1.id
            creep.memory.targetId = target.id
        }

        let target0 = Game.getObjectById(creep.memory.sourceTarget0Id)
        let target1 = Game.getObjectById(creep.memory.sourceTarget1Id)
        let target = Game.getObjectById(creep.memory.targetId)
        let resouces = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (s) => s.amount >= 200 && s.resourceType == RESOURCE_ENERGY
        })

        if (!creep.memory.storagesId) {
            let storages = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_STORAGE
            })

            creep.memory.storagesId = storages[0].id
            Memory.E59S1.storages.id = storages[0].id
        }

        let storages = Game.getObjectById(creep.memory.storagesId)

        if (creep.store[RESOURCE_ENERGY] == 0) {
            if (resouces) {
                if (creep.pickup(resouces) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(resouces)
                }
            } else if (target0 && target.store.getCapacity() >= 800) {
                if (creep.withdraw(target0, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target0)
                }
            } else if (target1 && target.store.getCapacity() >= 800) {
                if (creep.withdraw(target1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target1)
                }
            }
        } else if (target && target.store.getFreeCapacity() >= 500) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        } else if (storages) {
            if (creep.transfer(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storages)
            }
        }
    }
}