const TaskConfig = {
  work: function (roomName) {
    let energyTask = {
      Spawn: 0,
      Extension: 1,
      tower: 2,
      powerSpawn: 3,
      lab: 4,
      factory: 5,
      nuker: 6
    }

    let extensions;
    if (!extensions) {
      extensions = Game.rooms[roomName].find(FIND_STRUCTURE, {
        filter: (s) => s.structureType == STRUCTURE_EXTENSION
      })
    }



  }
}

module.exports = TaskConfig