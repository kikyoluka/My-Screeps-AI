//harvest部署
const Harvest = {
  run: function (creep) {
    var sources = creep.room.find(FIND_SOURCES);
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    if (creep.store.getFreeCapacity() == 0) {
      creep.say('填充');
      if (target.store.getFreeCapacity() == 0) {
        creep.say('容器装满了 我丢')
      }
      else if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }

    if (creep.memory.doing == 'source0') {
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0])
      }
    }

    if (creep.memory.doing == 'source1') {
      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1])
      }
    }
  }
}


module.exports = Harvest;

//Upgrader 部署
const Upgrad = {
  run: function (creep) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    if (creep.room.controller) {
      if (target.store.getFreeCapacity() == 2000) {
        creep.say('能量被我吃完了')
      }
      else if (creep.store.getFreeCapacity() > 200) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target)
        }
      } else {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller);
        }
      }
    }
  }
}

module.exports = Upgrad;

//Transfer 部署
const Transfer = {
  run: function (creep) {
    var roomController = creep.room.controller;
    var sources = creep.room.find(FIND_SOURCES);
    var containerTo = roomController.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    var containerFrom0 = sources[0].pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    var containerFrom1 = sources[1].pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });

    if (creep.memory.doing == 'container0') {
      if (creep.store.getFreeCapacity() >= 350) {
        creep.say('我来拿能量了')
        if (creep.withdraw(containerFrom0, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(containerFrom0)
        }
      } else {
        if (target) {
          if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            creep.say('填充')
          }
        }
      }
    }

    if (creep.memory.doing == 'container1') {
      if (creep.store.getFreeCapacity() >= 350) {
        creep.say('我来拿能量了')
        if (creep.withdraw(containerFrom1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(containerFrom1)
        }
      } else {
        if (containerTo) {
          if (containerTo.store.getFreeCapacity() > 0) {
            if (creep.transfer(containerTo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(containerTo);
              creep.say('填充')
            }
          } else {
            creep.say('都满了你让我咋填')
          }
        }
      }
    }

  }
}


module.exports = Transfer;





//炮塔部署 优先攻击治疗单位
const Tower = {
  run: function (room) {
    for (var i in Game.rooms) {
      if (!Game.rooms[i].memory.tower) {
        Game.rooms[i].memory.tower = Game.rooms[i].find(FIND_STRUCTURES, {
          filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
          }
        });
      }

      for (var j of Game.rooms[i].memory.tower) {
        const towers = Game.getObjectById(j.id)

        //找到具有治疗部件的单位
        var healHostile = towers.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
          filter: function (object) {
            return object.getActiveBodyparts(HEAL);
          }
        });

        //找到其他单位
        var otherHostile = towers.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
          filter: function (object) {
            return object.getActiveBodyparts(ATTACK)
              || object.getActiveBodyparts(MOVE)
              || object.getActiveBodyparts(RANGED_ATTACK)
              || object.getActiveBodyparts(TOUGH)
          }
        });

        //当修理工出现问题导致建筑耐久继续下降时启用炮塔进行紧急维修
        var closestDamagedStructure = towers.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.hits < structure.hitsMax * 0.4
              && structure.structureType != STRUCTURE_WALL
              && structure.structureType != STRUCTURE_RAMPART
              || structure.hits < 50000
              && structure.structureType == STRUCTURE_WALL
              || structure.hits < 50000
              && structure.structureType == STRUCTURE_RAMPART);
          }
        });

        //如果有治疗单位 优先攻击
        if (healHostile) {
          towers.attack(healHostile);
        } else if (otherHostile) {
          towers.attack(otherHostile);
        } else if (closestDamagedStructure) {
          towers.repair(closestDamagedStructure);
        }
      }
    }
  }
}

module.exports = Tower;


//维修工
const Repair = {
  run: function (creep) {
    const target = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_STORAGE
    });

    const needBuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    /**
     * wall < 100K 
     * rampart < 100K 
     * structure.hit <structure.hitx * 0.6 
     */
    const needRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.hits < structure.hitsMax * 0.6
          && structure.structureType != STRUCTURE_WALL
          && structure.structureType != STRUCTURE_RAMPART
          || structure.hits < 100000
          && structure.structureType == STRUCTURE_WALL
          || structure.hits < 100000
          && structure.structureType == STRUCTURE_RAMPART);
      }
    });

    if (creep.store.getFreeCapacity() > 200) {
      if (creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target[0])
      }
    } else if (needBuild) {
      creep.say('建造')
      if (creep.build(needBuild) == ERR_NOT_IN_RANGE) {
        creep.moveTo(needBuild);
      }
    }
    else if (needRepair) {
      creep.say('维修')
      if (creep.repair(needRepair) == ERR_NOT_IN_RANGE) {
        creep.moveTo(needRepair);
      }
    } else {
      creep.say('Zzz...')
    }

  }
}

module.exports = Repair;


