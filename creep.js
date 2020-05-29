/* creep配置 */
const CreepConfig = {
  _run: function () {
    for (var i in Game.creeps) {
      var creep = Game.creeps[i]
      switch (creep.memory.roleName) {
        case 'roleFiller':
          this._fill(creep)
          break;
        case 'roleHarvester':
          this._harvest(creep)
          break;
        case 'roleUpgrader':
          this._upgrad(creep)
          break;
        case 'roleBuilder':
          this._build(creep)
          break;
        case 'roleCenterFiller':
          this._centerFill(creep)
          break;
        case 'roleTransfer':
          this._transfer(creep)
          break;
        case 'roleRepair':
          this._repair(creep)
          break;
        case 'roleAttacker':
          this._attacker(creep)
          break;
        case 'rolePbAttacker':
          this._pbAttacker(creep)
          break;
        case 'rolePbHealer':
          this._pbHealer(creep)
          break;
        case 'rolePbTransfer':
          this._pbTransfer(creep)
          break;
        case "roleWarder":
          this._warder(creep)
          break;
        case "roleDepositer":
          this._deHarvester(creep)
      }
    }
  },

  /**
   * filler
   * @param {Object} creep 
   */
  _fill: function (creep) {
    let fillTargets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => {
        return (
          s.structureType == STRUCTURE_SPAWN &&
          s.store.getFreeCapacity() > 0 ||
          s.structureType == STRUCTURE_EXTENSION &&
          s.store.getFreeCapacity() > 0 ||
          s.structureType == STRUCTURE_TOWER &&
          s.store[RESOURCE_ENERGY] <= 600
        )
      }
    })

    let storageTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)
    let terminals = Game.getObjectById(Memory.roomConfig[creep.room.name].Terminal.id)
    /* 填充能量 */
    if (fillTargets.length > 0) {
      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.transfer(fillTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(fillTargets[0])
      }
    } else if (Memory.roomConfig[creep.room.name].Storage.overflow) {
      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.transfer(terminals, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(terminals)
      }
    }

    if (creep.ticksToLive <= 20) {
      creep.say('🔪 awsl')
      Memory.roomConfig[creep.room.name].Spawnlist.filler.count--
    }
  },

  /**
   * harvester
   * @param {Object} creep 
   */
  _harvest: function (creep) {
    let status;
    let sourceTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Source1.id)
    let storageTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)

    if (sourceTarget.energy == 0) {
      sourceTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Source2.id)
      status = true
    }

    /* 采矿 */
    if (creep.harvest(sourceTarget) == OK) {
      if (status) {
        delete creep.memory.harvesterSourcesLinkId
        status = false
      }

      if (!creep.memory.harvesterSourcesLinkId) {
        let links = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_LINK
        })

        creep.memory.harvesterSourcesLinkId = links.id
      }
      creep.harvest(sourceTarget);
    } else {
      creep.moveTo(sourceTarget)
    }

    if (creep.store[RESOURCE_ENERGY] !== 0) {
      let sendLink = Game.getObjectById(creep.memory.harvesterSourcesLinkId)
      /* 找不到link就填storage */
      if (!creep.memory.harvesterSourcesLinkId) {
        if (creep.transfer(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.transfer(sendLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sendLink)
      }
      /* 找到link就填link */
      if (sendLink.store[RESOURCE_ENERGY] >= 100) {
        let centerLink = Game.getObjectById(Memory.roomConfig[creep.room.name].Centerlink.id)
        sendLink.transferEnergy(centerLink)
      }
    }

    if (creep.ticksToLive <= 20) {
      creep.say('🔪 awsl')
      Memory.roomConfig[creep.room.name].Spawnlist.harvester.count--
    }
  },

  /**
   * upgrader
   * @param {Object} creep 
   */
  _upgrad: function (creep) {
    /* 枢纽升级 */
    let controller = Game.getObjectById(Memory.roomConfig[creep.room.name].Controller.id)
    let linkTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Controllerlink.id)

    if (creep.store[RESOURCE_ENERGY] == 0) {
      if (creep.withdraw(linkTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(linkTarget)
      }
    } else {
      if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller)
      }
    }
  },

  /**
   * builder
   * @param {Object} creep 
   */
  _build: function (creep) {
    let storageTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)
    /* 如果有建筑任务就建造 没有就自杀 */
    if (!creep.memory.warStatus) {
      if (!creep.memory.builderTargetId) {
        if (creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
          let needBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)
          creep.memory.builderTargetId = needBuild.id
        } else {
          creep.suicide()
        }
      }

      /* 建造 */
      if (creep.memory.builderTargetId) {
        let buildTarget = Game.getObjectById(creep.memory.builderTargetId)

        if (creep.store[RESOURCE_ENERGY] == 0) {
          if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storageTarget)
          }
        } else if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(buildTarget)
        }
      }
    } else {
      let target = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits <= 1000000
      })

      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.repair(target[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target[0])
      }
    }
  },

  /**
   * center transfer
   * @param {Object} creep 
   */
  _centerFill: function (creep) {
    let storageTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)

    /* power填充 */
    let powerTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].PowerSpawn.id)
    if (powerTarget.store[RESOURCE_ENERGY] < 2000) {
      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sourceTarget)
          creep.say('PowerSpawn填Energy')
        }
      } else if (creep.transfer(powerTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(powerTarget)
      }
    } else if (powerTarget.store[RESOURCE_POWER] < 50) {
      if (creep.store[RESOURCE_POWER] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sourceTarget)
          creep.say('PowerSpawn填Power')
        }
      } else if (creep.transfer(powerTarget, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
        creep.moveTo(powerTarget)
      }
    }

    /* lab填充 */
    if (!creep.memory.centerFillerLabId) {
      let labTargets = creep.room.find(FIND_STRUCTURES, {
        filter: (s) => {
          return (s.structureType == STRUCTURE_LAB && s.store[RESOURCE_ENERGY] < 1500)
        }
      })

      creep.memory.centerFillerLabId = labTargets[0].id
      creep.say('centerFillerLabId记忆载入成功')
    }

    let labTarget = Game.getObjectById(creep.memory.centerFillerLabId)
    if (creep.store[RESOURCE_ENERGY] == 0) {
      if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storageTarget)
      }
    } else if (creep.transfer(labTarget, RESOURCE_ENERGY) == OK) {
      creep.transfer(labTarget, RESOURCE_ENERGY)
      creep.say('重载')
      delete creep.memory.centerFillerLabId
    } else {
      creep.moveTo(labTarget)
      creep.say('Lab填Energy')
    }

    /* nuker填充 */
    let nukerTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Nuker.id)
    if (nukerTarget.store[RESOURCE_ENERGY] < 300000) {
      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.transfer(nukerTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(nukerTarget)
        creep.say('Nuker填Energy')
      }
    } else if (nukerTarget.store[RESOUCE_GHODIUM] < 5000) {
      if (creep.store[RESOUCE_GHODIUM] == 0) {
        if (creep.withdraw(storageTarget, RESOUCE_GHODIUM) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storageTarget)
        }
      } else if (creep.transfer(nukerTarget, RESOUCE_GHODIUM) == ERR_NOT_IN_RANGE) {
        creep.moveTo(nukerTarget)
        creep.say('Nuker填GHODIUM')
      }
    }

    if (creep.ticksToLive <= 20) {
      creep.say('🔪 awsl')
      Memory.roomConfig[creep.room.name].Spawnlist.centerFiller.count--
    }
  },

  /**
   * transfer
   * @param {Object} creep 
   */
  _transfer: function (creep) {
    let storageTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)
    let resource = creep.room.find(FIND_DROPPED_RESOURCES)
    let linkTarget = Game.getObjectById(Memory.roomConfig[creep.room.name].Centerlink.id)

    /* 中央link有能量就拿 没有就捡垃圾 */
    if (creep.store[RESOURCE_ENERGY] == 0) {
      if (linkTarget.store[RESOUCE_ENERGY] >= 400) {
        if (creep.withdraw(linkTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(linkTarget)
        }
      } else if (resource) {
        if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(resource)
          creep.say('捡垃圾')
        }
      }
    } else if (creep.transfer(storageTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(storageTarget)
      creep.say('Storage填Energy')
    }

    if (creep.ticksToLive <= 20) {
      creep.say('🔪 awsl')
      Memory.roomConfig[creep.room.name].Spawnlist.transfer.count--
    }
  },

  /**
   * nuker repair
   * @param {Object} creep 
   */
  _repair: function (creep) {
    let storages = Game.getObjectById(Memory.roomConfig[creep.room.name].Storage.id)
    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits <= 11000000
    })

    if (targets.length > 0) {
      if (creep.store[RESOURCE_ENERGY] == 0) {
        if (creep.withdraw(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(storages)
        }
      } else if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0])
      }
    } else {
      creep.say('Zzz')
    }
  },

  /**
   * attacker
   * @param {Object} creep 
   * @param {String} roomName 
   * @param {Number} pos 
   * @param {Object} target 
   */
  _attacker: function (creep, roomName, pos, target) {
    let team = Game.creeps.filter((x) => x.memory.role == 'attacker')
    let notYet = team.filter((x) => x.room.name == roomName ? false : true)
    /* 进攻小队在同一房间 */
    if (!notYet) {
      /* 是否有指定攻击目标 */
      if (target) {
        /* 攻击目标路途中受到阻拦则找到最近的一个rampart进行攻击 */
        if (creep.moveTo(target) == ERR_NO_PATH) {
          let rua = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_RAMPART
          })

          creep.attack(rua)
        } else if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          /* 没遇到阻拦则直接去攻击目标 */
          creep.moveTo(target)
        }
      } else {
        /* 没有指定目标就攻击tower和spawn */
        let targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {
          filter: (s) => {
            return (
              s.structureType == STRUCTURE_TOWER ||
              s.structureType == STRUCTURE_SPAWN
            )
          }
        })

        if (creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0])
        }
      }
    } else {
      /* 进攻小队没在同一房间则等待就位 */
      creep.moveTo(new RoomPosition(pos, roomName));
      creep.say('reading')
    }
  },

  /**
   * pbAttacker
   * @param {String} roomName 出生地
   * @param {String} pbRoom
   * @param {String} pbId 攻击单位
   */
  _pbAttacker: function (creep) {
    let roomName = creep.memory.roomName
    let target = Game.getObjectById(creep.memory.pbId)
    if (!Memory.roomConfig[roomName].powerBanks.run.attack) {
      if (creep.pos.isNearTo(target)) {
        creep.say('⚔ ready')
        Memory.roomConfig[roomName].powerBanks.run.attack = true
      } else {
        creep.moveTo(target)
      }
    }

    if (Memory.roomConfig[roomName].powerBanks.run.ready) {
      creep.attack(target)
      creep.say(`还剩 + ${target.hits} , 需要 ${target.hits / 1200} tick`)
    }

    if (target.hits <= 10000 || target.hits / 1200 <= 100) {
      Memory.roomConfig[roomName].powerBanks.run.transfer = true
    }
  },

  /**
   * pbAttackHealer
   * @param {String} roomName 出生地
   * @param {String} pbRoom 
   */
  _pbHealer: function (creep) {
    let target
    let roomName = creep.memory.roomName
    if (!target) {
      target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (s) => s.memory.roleName == rolePbAttacker
      })
    }

    if (!Memory.roomConfig[roomName].powerBanks.run.heal) {
      if (creep.pos.isNearTo(target)) {
        creep.say('🔧 ready')
        Memory.roomConfig[roomName].powerBanks.run.heal = true
      } else {
        creep.moveTo(target)
      }
    }

    if (Memory.roomConfig[roomName].powerBanks.run.attack && Memory.roomConfig[roomName].powerBanks.run.heal) {
      Memory.roomConfig[roomName].powerBanks.run.ready = true
    }

    if (Memory.roomConfig[roomName].powerBanks.run.ready) {
      creep.heal(target)
    }
  },

  /**
   * pbTransfer
   * @param {String} roomName 出生地
   * @param {String} targetId 终端
   * @param {String} pbId 
   */
  _pbTransfer: function (creep) {
    let terminals = Game.getObjectById(Memory.roomConfig[creep.memory.roomName].Terminal.id)
    let target = Game.getObjectById(creep.memory.pbId)
    let pbRoom = creep.memory.pbRoom
    if (target) {
      creep.moveTo(target)
    } else if (creep.store[RESOURCE_POWER] == 0) {
      let sources = Game.rooms[pbRoom].find(FIND_DROPPED_RESOURCES)
      if (creep.pickup(sources) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources)
      }
    } else if (creep.transfer(terminals, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
      creep.moveTo(terminals)
    }
  },

  /**
   * deposit采集
   * @param {Object} creep
   * @param {String} roomName 出生地
   * @param {String} deId 采集单位
   * @param {String} type 矿物类型
   */
  _deHarvester: function (creep, roomName, deId, type) {
    let terminals = Game.getObjectById(Memory.roomConfig[roomName].Terminal.id)
    let target = Game.getObjectById(deId)
    if (creep.store[Type] == 0 && creep.ticksToLive > 100) {
      if (creep.harvest(target, type) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    } else if (creep.transfer(terminals, type) == ERR_NOT_IN_RANGE) {
      creep.moveTo(terminals)
    }

    if (target.lastCooldown >= 80) {
      Memory.roomConfig[roomName].deposits.status = false
    }
  }
}

module.exports = CreepConfig