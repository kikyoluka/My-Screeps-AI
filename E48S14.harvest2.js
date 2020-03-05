const E48S14Harvester2 = {
  run: function (creep) {
    var sources = creep.room.find(FIND_SOURCES);
    var target = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER)
        }
      });

    if(creep.store.getFreeCapacity() > 0){
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0])
        }
    }
    else{
        if (creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
    
        if(target[0].store.getFreeCapacity() == 0){
        creep.drop(RESOURCE_ENERGY)
    }
  }
}


module.exports = E48S14Harvester2;