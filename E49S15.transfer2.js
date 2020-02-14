const E49S15Transfer2 = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER)
      }
    });

    if (creep.store.getFreeCapacity() > 150) {
      if (creep.withdraw(targets[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[2]);
      }
    }
    else {
      var target = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (target.length > 0) {
        if (creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
      else {
        if (targets[1].store.getFreeCapacity() > 0) {
          if (creep.transfer(targets[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[1]);
          }
        }
      }
    }


  }
}

module.exports = E49S15Transfer2;