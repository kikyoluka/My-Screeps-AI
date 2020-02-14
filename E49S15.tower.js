const E49S15Tower = {
  run: function () {
    var tower1 = Game.getObjectById('5e3c0693e3a52d6af45770de');
    if (tower1) {
      var closestDamagedStructure = tower1.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 20000
      });
      if (closestDamagedStructure) {
        tower1.repair(closestDamagedStructure);
      }

      var closestHostile = tower1.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower1.attack(closestHostile);
      }
    }

    var tower2 = Game.getObjectById('5e40caa0b5547db1fc50b2ae');
    if (tower2) {
      var closestHostile = tower2.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (closestHostile) {
        tower2.attack(closestHostile);
      }
    }
  }
}


module.exports = E49S15Tower;