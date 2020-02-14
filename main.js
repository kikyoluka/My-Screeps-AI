//导入E49S15房间配置文件
const E49S15Harvester = require('E49S15.harvester');
const E49S15Harvester2 = require('E49S15.harvester2');
const E49S15Harvester3 = require('E49S15.harvester3');
const E49S15Upgrader = require('E49S15.upgrader');
const E49S15Builder = require('E49S15.builder');
const E49S15Transfer = require('E49S15.transfer');
const E49S15Transfer2 = require('E49S15.transfer2');
const E49S15Scavenger = require('E49S15.scavenger');
const E49S15Tower = require('E49S15.tower');

//导入E49S14房间配置文件
const E49S14Builder = require('E49S14.builder');
const E49S14Harvester = require('E49S14.harvester');
const E49S14Upgrader = require('E49S14.upgrader');
const E49S14Tower = require('E49S14.tower')

//导入stateScanner配置文件
const stateScanner = require('stateScanner');

module.exports.loop = function () {
  //运行stateScanner
  stateScanner();
	
	
  //运行E49S15防御塔
  E49S15Tower.run();

  //运行E49S14防御塔
  E49S14Tower.run();

  //如果creep挂了，删除它的记忆
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  //E49S15房间中一号能量矿没有矿机就自动生产
  const E49S15Harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15harvester');
  if (E49S15Harvesters.length < 1) {
    var newName = 'E49S15Harvester' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], newName,
      { memory: { role: 'e49s15harvester' } });
  }

  //E49S15房间中二号能量矿没有矿机就自动生产
  const E49S15Harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15harvester2');
  if (E49S15Harvesters2.length < 1) {
    var newName = 'E49S15Harvester2' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, MOVE], newName,
      { memory: { role: 'e49s15harvester2' } });
  }

  //E49S15房间中化合矿物没有矿机就自动生产
  const E49S15Harvesters3 = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15harvester3');
  if (E49S15Harvesters3.length < 1) {
    var newName = 'E49S15Harvester3' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName,
      { memory: { role: 'e49s15harvester3' } });
  }

  //E49S15房间中枢纽升级器数量小于两个就自动生产
  const E49S15Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15upgrader');
  if (E49S15Upgraders.length < 2) {
    var newName = 'E49S15Upgrader' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'e49s15upgrader' } });
  }

  //E49S15房间中没有建造机就自动生产
  const E49S15Builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15builder');
  if (E49S15Builders.length < 1) {
    var newName = 'E49S15Builder' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'e49s15builder' } });
  }

  //E49S15房间中没有一号运输机就自动生产
  const E49S15Transfers = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15transfer');
  if (E49S15Transfers.length < 1) {
    var newName = 'E49S15Transfer' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'e49s15transfer' } });
  }

  //E49S15房间中没有二号运输机就自动生产
  const E49S15Transfers2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15transfer2');

  if (E49S15Transfers2.length < 1) {
    var newName = 'E49S15Transfer2' + Game.time;
    Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
      { memory: { role: 'e49s15transfer2' } });
  }


  //E49S15房间中出现墓碑就自动生产清道夫
  const target = Game.spawns['Spawn1'].pos.findClosestByRange(FIND_TOMBSTONES);
  const E49S15Scavengers = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s15scavenger');
  if (target && E49S15Scavengers.length < 1) {
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'E49S15Scavenger', {
      memory: { role: 'e49s15scavenger' }
    });
  }

  //E49S14房间中一号能量矿没有矿机就自动生产
  const E49S14Harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s14harvester');
  if (E49S14Harvesters.length < 1) {
    var newName = 'E49S14Harvester' + Game.time
    Game.spawns['Spawn2'].spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: 'e49s14harvester' } });
  }

  //E49S14房间中枢纽升级器小于三个就自动生产
  const E49S14Upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s14upgrader');
  if (E49S14Upgraders.length < 3) {
    var newName = 'E49S14Upgrader' + Game.time
    Game.spawns['Spawn2'].spawnCreep([WORK, WORK, CARRY, MOVE], newName,
      { memory: { role: 'e49s14upgrader' } });
  }

  //E49S14房间中建造机数量小于两个就自动生产
  const E49S14Builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'e49s14builder');
  if (E49S14Builders.length < 2) {
    var newName = 'E49S14Builder' + Game.time
    Game.spawns['Spawn2'].spawnCreep([WORK, CARRY, CARRY, MOVE], newName,
      { memory: { role: 'e49s14builder' } });
  }

  //E49S15房间生产说明生产对象
  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  }

  //E49S14房间生产说明生产对象
  if (Game.spawns['Spawn2'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn2'].spawning.name];
    Game.spawns['Spawn2'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn2'].pos.x + 1,
      Game.spawns['Spawn2'].pos.y,
      { align: 'left', opacity: 0.8 });
  }


  //根据记忆为每个房间的creep分配工作
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'e49s15harvester') {
      E49S15Harvester.run(creep);
    }

    if (creep.memory.role == 'e49s15harvester2') {
      E49S15Harvester2.run(creep);
    }

    if (creep.memory.role == 'e49s15harvester3') {
      E49S15Harvester3.run(creep);
    }

    if (creep.memory.role == 'e49s15upgrader') {
      E49S15Upgrader.run(creep);
    }

    if (creep.memory.role == 'e49s15builder') {
      E49S15Builder.run(creep);
    }

    if (creep.memory.role == 'e49s15transfer') {
      E49S15Transfer.run(creep);
    }
    if (creep.memory.role == 'e49s15transfer2') {
      E49S15Transfer2.run(creep);
    }

    if (creep.memory.role == 'e49s15scavenger') {
      E49S15Scavenger.run(creep);
    }

    if (creep.memory.role == 'e49s14builder') {
      E49S14Builder.run(creep);
    }

    if (creep.memory.role == 'e49s14upgrader') {
      E49S14Upgrader.run(creep);
    }

    if (creep.memory.role == 'e49s14harvester') {
      E49S14Harvester.run(creep);
    }

  }
}
