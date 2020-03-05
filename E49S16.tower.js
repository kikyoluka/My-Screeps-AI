const E49S16Tower = {
  run: function () {
    var tower1 = Game.getObjectById('5e4dfbfbdbfd3736eae453ce');
    if (tower1) {
      var closestDamagedStructure = tower1.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
              structure.hits < structure.hitsMax * 0.5
              && structure.structureType != STRUCTURE_WALL
              && structure.structureType != STRUCTURE_RAMPART
              || structure.hits < 20000
              && structure.structureType == STRUCTURE_WALL
              || structure.hits < 20000
              && structure.structureType == STRUCTURE_RAMPART);
        }
      });
      if (closestDamagedStructure) {
        tower1.repair(closestDamagedStructure);
      }

      var closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower1.attack(closestHostile);
      }
    }
    
    var tower2 = Game.getObjectById('5e528fae9a1c38ee7a3ea6ce');
    if (tower2) {
      var closestDamagedStructure = tower2.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
              structure.hits < structure.hitsMax * 0.5
              && structure.structureType != STRUCTURE_WALL
              && structure.structureType != STRUCTURE_RAMPART
              || structure.hits < 20000
              && structure.structureType == STRUCTURE_WALL
              || structure.hits < 20000
              && structure.structureType == STRUCTURE_RAMPART);
        }
      });
      if (closestDamagedStructure) {
        tower2.repair(closestDamagedStructure);
      }

      var closestHostile = tower2.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower2.attack(closestHostile);
      }
    }
  }
}


module.exports = E49S16Tower;