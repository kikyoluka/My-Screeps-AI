const E48S14Transfer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    var storages = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_CONTAINER)
        }
      });
      
    if(creep.store.getFreeCapacity() > 0){
        if(creep.withdraw(storages[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(storages[0]);
        }
    }
    else{
      if(creep.transfer(storages[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(storages[1])
      }
    }
    
        

    

  }
}

module.exports = E48S14Transfer;