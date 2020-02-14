const E49S14Tower = {
  run: function () {
    var tower1 = Game.getObjectById('5e462c26cc3c26471ee9f033');
    if (tower1) {
      var closestDamagedStructure = tower1.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax
      });
      if (closestDamagedStructure) {
        tower1.repair(closestDamagedStructure);
      }

      var closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower1.attack(closestHostile);
      }
    }
  }
}


module.exports = E49S14Tower;