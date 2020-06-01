Creep.prototype._widthdraw = function (target, type) {
  if (creep.widthdraw(target, type) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._transfer = function (target, type) {
  if (creep.transfer(target, type) == ERR_NOT_IN_RANGE) creep.moveTo(taeget)
}

Creep.prototype._upgradeController = function (target) {
  if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._build = function (target) {
  if (creep.build(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._repair = function (target) {
  if (creep.repair(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._pickup = function (target) {
  if (creep.pickup(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._attack = function (target) {
  if (creep.attack(target) == ERR_NOT_IN_RANGE) creep.moveTo(target)
}

Creep.prototype._newRoomBuild = function (newRoom) {
  if (creep.room.name !== newRoom) {
    creep.moveTo(newRoom)
  } else {
    let sources = creep.room.find(FIND_SOURCES)
    if (creep.store[RESOURCE_ENERGY] == 0) {
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) creep.moveTo(sources[0])
    } else {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES)
      if (targets.length > 0) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) creep.moveTo(target[0])
      }
    }
  }
}