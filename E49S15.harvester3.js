const E49S15harvester3 = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var minerals = creep.room.find(FIND_MINERALS);
    if (creep.store.getFreeCapacity() > 0) {
      if (creep.harvest(minerals[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(minerals[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    if (creep.store.getFreeCapacity() == 0) {
      var storages = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_STORAGE)
        }
      });

      if (creep.transfer(storages[0], 'Z') == ERR_NOT_IN_RANGE) {
        creep.moveTo(storages[0])
      }
    }
  }
}

module.exports = E49S15harvester3;