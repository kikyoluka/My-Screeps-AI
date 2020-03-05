const E49S16Transfer2 = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var target = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType == STRUCTURE_CONTAINER)
      }
    });
    
    if (creep.store.getFreeCapacity() > 150) {
      if (creep.withdraw(target[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target[1]);
      }
    }
    else {
        var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER) 
        }
      });
        if (creep.transfer(targets[2], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[2]);
        }
      }

  }
}

module.exports = E49S16Transfer2;