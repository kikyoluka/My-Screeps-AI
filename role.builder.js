var roleBuilder = {

  /** @param {Creep} creep **/
  run: function (creep) {

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
    }

    if (creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    const target = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.hits < object.hitsMax
    });

    target.sort((a, b) => a.hits - b.hits);
    if (creep.store.getFreeCapacity() > 0) {
      if (target.length > 0) {
        if (creep.repair(target[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0]);
        }
      }
    }
  }
};

module.exports = roleBuilder;
