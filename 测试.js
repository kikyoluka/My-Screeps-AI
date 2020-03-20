//harvest
const Harvest = {
  run: function (creep) {
    const sources = creep.room.find(FIND_SOURCES);
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    if (creep.store.getFreeCapacity() == 0) {
      creep.say('填充');
      if (target.store.getFreeCapacity() == 0) {
        creep.say('容器装满了，我丢')
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

//upgrader 
const Upgrad = {
  run: function (creep) {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    if (creep.room.controller) {
      if (target.store.getFreeCapacity() == 2000) {
        creep.say('能量被我吃完了')
      }
      else if (creep.store.getFreeCapacity() > 50) {
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target)
        }
      }
      else if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
      else {
        creep.say('升级中~')
      }
    }
  }
}
module.exports = Upgrad;

//Build
const Build = {
  /** @param {Creep} creep **/
  run: function (creep) {
    /**
     * wall < 100K 
     * rampart < 100K 
     */
    const needRepair = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          structure.structureType == STRUCTURE_WALL
          || structureType == STRUCTURE_RAMPART)
          && structure.hits < 1000000;
      }
    });

    if (needRepair[0]) {
      if (creep.repair(needRepair[0]) == ERR_NOT_IN_RANGE) {
        creep.say('维修')
        creep.moveTo(needRepair[0]);
      }
    }
  }
}

module.exports = Build;


//Transfer 
const Transfer = {
  run: function (creep) {
    const roomController = creep.room.controller;
    const sources = creep.room.find(FIND_SOURCES);
    const containerTo = roomController.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    const containerFrom0 = sources[0].pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    const containerFrom1 = sources[1].pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_CONTAINER
    });

    const storages = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_STORAGE
    });

    const target = creep.room.find(FIND_DROPPED_RESOURCES);

    if (creep.store.getFreeCapacity() > 0) {
      if (target) {
        if (creep.pickup(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0]);
          creep.say('捡垃圾啦')
        }
      } else if (containerFrom1.store.getFreeCapacity() < 1000) {
        if (creep.withdraw(containerFrom1, RESOURCE_ENERGY)
          == ERR_NOT_IN_RANGE) {
          creep.moveTo(containerFrom1);
          creep.say('我来S1拿能量了');
        }
      } else if (containerFrom0.store.getFreeCapacity() < 1000) {
        if (creep.withdraw(containerFrom0, RESOURCE_ENERGY)
          == ERR_NOT_IN_RANGE) {
          creep.moveTo(containerFrom0);
          creep.say('我来S0拿能量了');
        }
      }
    } else if (containerTo.store[RESOURCE_ENERGY] > 1000) {
      if (creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storages[0]);
        creep.say('填充storage')
      }
    } else if (creep.transfer(containerTo, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(containerTo);
      creep.say('填充up')
    }
  }
}

module.exports = Transfer;


//Fill && Repair && Build
const Repair = {
  run: function (creep) {
    const target = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_STORAGE
    });

    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });


    const needBuild = creep.room.find(FIND_CONSTRUCTION_SITES);
    const pickupEnergy = creep.room.find(FIND_DROPPED_RESOURCES);


    if (creep.store.getFreeCapacity() > 200) {
      if (creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.say('我来拿资源啦~');
        creep.moveTo(target[0]);
      }
    } else if (targets[0]) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.say('填充能量')
        creep.moveTo(targets[0]);
      }
    } else if (needBuild[0]) {
      if (creep.build(needBuild[0]) == ERR_NOT_IN_RANGE) {
        creep.say('建造')
        creep.moveTo(needBuild[0]);
      }
    } else {
      creep.say('Zzz')
    }

    if (pickupEnergy[0]) {
      if (creep.pickup(pickupEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(pickupEnergy[0]);
        creep.say('捡垃圾')
      }
    }
  }
}

module.exports = Repair;


//Tower
const Tower = {
  run: function () {
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
        const healHostile = towers.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
          filter: function (object) {
            return object.getActiveBodyparts(HEAL);
          }
        });

        //找到其他单位
        const otherHostile = towers.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
          filter: function (object) {
            return object.getActiveBodyparts(ATTACK)
              || object.getActiveBodyparts(MOVE)
              || object.getActiveBodyparts(RANGED_ATTACK)
              || object.getActiveBodyparts(TOUGH)
          }
        });

        const closestDamagedStructure = towers.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.hits < structure.hitsMax * 0.6
              && structure.structureType != STRUCTURE_WALL
              && structure.structureType != STRUCTURE_RAMPART
            );
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




//main.js
const Tower = require('tower');
const Harvest = require('harvest');
const Repair = require('repair');
const Transfer = require('transfer');
const Upgrad = require('upgrad');

module.exports.loop = function () {
  Tower.run();

  for (var i in Game.creeps) {
    var creep = Game.creeps[i];
    if (creep.memory.role == 'harvest') {
      Harvest.run(creep);
    }

    if (creep.memory.role == 'upgrad') {
      Upgrad.run(creep);
    }

    if (creep.memory.role == 'transfer') {
      Transfer.run(creep);
    }

    if (creep.memory.role == 'repair') {
      Repair.run(creep);
    }
  }


  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }


  const Repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
  if (Repairs.length < 1 || Repairs[0].ticksToLive < 20) {
    var newName = '全能工具姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'repair' } }
    );
  }

  const S0Harvests = _.filter(Game.creeps, (creep) => creep.memory.doing == 'source0')
  if (S0Harvests.length < 1 || S0Harvests[0].ticksToLive < 20) {
    var newName = '矿姬S0型' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'harvest', doing: 'source0' } }
    );
  }

  const S1Harvests = _.filter(Game.creeps, (creep) => creep.memory.doing == 'source1')
  if (S1Harvests.length < 1 || S1Harvests[0].ticksToLive < 20) {
    var newName = '矿姬S1型' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'harvest', doing: 'source1' } }
    );
  }

  const Transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer')
  if (Transfers.length < 2 || Transfers[0].ticksToLive < 20
    || Transfers[1].ticksToLive < 20) {
    var newName = '运输姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'transfer' } }
    );
  }

  const Upgrads = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrad')
  if (Upgrads.length < 1 || Upgrads[0].ticksToLive < 20) {
    var newName = '升级姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'upgrad' } }
    );
  }
}


//pickup
const Pickup = {
  run: function (creep) {
    var a = Game.getObjectById('a3f1a99bde0b7e20e781dcd3');
    var b = Game.getObjectById('234d8173c3a8474bd1b38013');
    for (var i in Game.creeps) {
      var creep = Game.creeps[i];
      if (creep.store.getFreeCapacity() > 0) {
        for (var resourceType in a.store) {
          if (creep.withdraw(a, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(a);
          }
        }
      } else {
        for (var resourceType in creep.carry) {
          if (creep.transfer(b, resourceType) == ERR_NOT_IN_RANGE) {
            creep.moveTo(b)
          }
        }
      }
    }
  }
}

module.exports = Pickup


//Attack
const Attack = {
  run: function (creep) {

  }
}

module.exports = Attack




//Creep.function
const Harvest = require('harvest');
const Upgrad = require('upgrad');
const Repair = require('repair');
const Transfer = require('transfer');
const Build = require('build')

const CreepFunction = {
  run: function () {
    for (var i in Game.creeps) {
      var creep = Game.creeps[i];
      switch (creep.memory.role) {
        case 'harvest':
          Harvest.run(creep);
          break;
        case 'upgrad':
          Upgrad.run(creep);
          break;
        case 'repair':
          Repair.run(creep);
          break;
        case 'transfer':
          Transfer.run(creep);
          break;
        case 'build':
          Build.run(creep);
      }
    }

    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    const Repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
    if (Repairs.length < 1 || Repairs[0].ticksToLive < 20) {
      var newName = '全能工具姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
      Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
        { memory: { role: 'repair' } }
      );
    }

    const S0Harvests = _.filter(Game.creeps, (creep) => creep.memory.doing == 'source0')
    if (S0Harvests.length < 1 || S0Harvests[0].ticksToLive < 20) {
      var newName = '矿姬S0型' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
      Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
        { memory: { role: 'harvest', doing: 'source0' } }
      );
    }

    const S1Harvests = _.filter(Game.creeps, (creep) => creep.memory.doing == 'source1')
    if (S1Harvests.length < 1 || S1Harvests[0].ticksToLive < 20) {
      var newName = '矿姬S1型' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
      Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], newName,
        { memory: { role: 'harvest', doing: 'source1' } }
      );
    }

    const Transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer')
    if (Transfers.length < 2 || Transfers[0].ticksToLive < 20 || Transfers[1].ticksToLive < 20) {
      var newName = '运输姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
      Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
        { memory: { role: 'transfer' } }
      );
    }

    const Upgrads = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrad')
    if (Upgrads.length < 1 || Upgrads[0].ticksToLive < 20) {
      var newName = '升级姬' + Math.random().toString(16).slice(2, 6).toUpperCase() + '号';
      Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
        { memory: { role: 'upgrad' } }
      );
    }
  }
}

module.exports = CreepFunction;





switch (room.controller.level) {
  case 1:
    harvestBody = [WORK, WORK, CARRY, MOVE]
    upgradBody = [WORK, WORK, CARRY, MOVE]
    buildBody = [WORK, CARRY, CARRY, MOVE, MOVE]
    repairBody = [WORK, CARRY, CARRY, MOVE, MOVE]
    transferBody = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    break;
  case 2:
    harvestBody = [WORK, WORK, WORK, CARRY, MOVE]
    upgradBody = [WORK, WORK, WORK, CARRY, MOVE]
    buildBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    repairBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    transferBody = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    break;
  case 3:
    harvestBody = [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
    upgradBody = [WORK, WORK, WORK, WORK, CARRY, MOVE]
    buildBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    repairBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
    transferBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    break;
  case 4:
  case 5:
    harvestBody = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE]
    upgradBody = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]
    buildBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    repairBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    transferBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    break;
  case 6:
  case 7:
  case 8:
    harvestBody = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
    upgradBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
    buildBody = [WORK, WORK, CARRY, CARRY, MOVE, MOVE]
    repairBody = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    transferBody = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
}

module.exports = {
  /**
  * 工作单位
  * 诸如 harvester、builder 之类的
  */
  harvest: {
    300: [WORK, CARRY, MOVE],
    550: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    1300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    1800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    2300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    5600: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    12900: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]
  },

  /**
   * 升级单位
   * 最大的身体部件只包含 12 个 WORK
   */
  upgrad: {
    300: [WORK, CARRY, MOVE],
    550: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    1300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    1800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    2300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    5600: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    12900: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE]
  },

  /**
   * 房间物流管理单位
   * 负责转移基地资源的 creep
   */
  transfer: {
    300: [CARRY, CARRY, MOVE],
    550: [CARRY, CARRY, MOVE, CARRY, MOVE],
    800: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    1300: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE],
    1800: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    2300: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    5600: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    12900: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]
  },

  /**
   * 中央物流管理单位
   * 负责转移中央物流的 creep
   */
  centerTransfer: {
    300: [CARRY, CARRY, MOVE],
    550: [CARRY, CARRY, MOVE],
    800: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    1300: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    1800: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    2300: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    5600: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
    12900: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
  },

  /**
   * 外矿预定单位
   */
  reserver: {
    300: [MOVE, CLAIM],
    550: [MOVE, CLAIM],
    800: [MOVE, CLAIM],
    1300: [MOVE, CLAIM],
    1800: [MOVE, CLAIM, MOVE, CLAIM],
    2300: [MOVE, CLAIM, MOVE, CLAIM],
    5600: [MOVE, CLAIM, MOVE, CLAIM],
    12900: [MOVE, CLAIM, MOVE, CLAIM],
  },

  /**
   * 基础攻击单位
   * 使用 attack 身体部件的攻击单位
   */
  attacker: {
    300: [MOVE, MOVE, ATTACK, ATTACK],
    550: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK],
    800: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK],
    1300: [MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    1800: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    2300: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    5600: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    12900: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
  },

  /**
   * 治疗单位
   */
  healer: {
    300: [MOVE, HEAL],
    550: [MOVE, HEAL],
    800: [MOVE, MOVE, HEAL, HEAL],
    1300: [MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL],
    1800: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    2300: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    5600: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    12900: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
  },

  /**
   * 外矿防御单位
   */
  remoteDefender: {
    300: [TOUGH, MOVE, ATTACK, MOVE],
    550: [TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE],
    800: [TOUGH, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE],
    1300: [TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE],
    1800: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE],
    2300: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE],
    5600: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE, HEAL, MOVE],
    12900: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, HEAL, MOVE, HEAL, MOVE],
  },

  /**
   * 拆除者身体
   */
  dismantler: {
    300: [TOUGH, MOVE, WORK, MOVE],
    550: [TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE],
    800: [TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    1300: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    1800: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    2300: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    5600: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
    12900: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE],
  },

  /**
   * 外矿采集者
   * 和采集者的区别就是外矿采集者拥有更多的 CARRY
   */
  remoteHarvester: {
    300: [WORK, CARRY, MOVE],
    550: [WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
    1300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE],
    1800: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    2300: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    5600: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    12900: [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]
  }
}
