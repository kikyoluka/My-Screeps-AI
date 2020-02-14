const E49S15Scavenger = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });

    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
    if (target && target.amount > 50) {
      if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    if (creep.store.getFreeCapacity() == 0) {
      if (targets.length > 0) {
        if (creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[1], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
}

module.exports = E49S15Scavenger;