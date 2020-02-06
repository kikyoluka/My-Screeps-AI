const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleTransfer = require('role.transfer');

module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

  if (upgraders.length < 2) {
    var newName = 'upgrader' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK,WORK, CARRY, MOVE], newName,
      { memory: { role: 'upgrader' } });
  }

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

  if (harvesters.length < 1) {
    var newName = 'Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE], newName,
      { memory: { role: 'harvester' } });
  }


  var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');

  if (builders.length < 2) {
    var newName = 'Builder' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: 'builder' } });
  }

  var transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'transfer');

  if (transfers.length < 2) {
    var newName = 'Transfer' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, MOVE, MOVE], newName,
      { memory: { role: 'transfer' } });
  }

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  }



  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == 'transfer') {
      roleTransfer.run(creep);
    }
  }
}
