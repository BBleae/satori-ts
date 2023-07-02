// TODO: rewrite this shit
export function run(creep: Creep) {
  console.log(`Running starter ${creep.name}`);
  if (creep.memory.state === 'init' || !creep.memory.state) {
    console.log(`Setting starter ${creep.name} to harvesting`);
    creep.memory.state = 'harvesting';
    creep.memory.targetId = creep.room.find(FIND_SOURCES)[0].id
    return
  }
  console.log(`Starter ${creep.name} state: ${creep.memory.state}`)
  switch (creep.memory.state) {
    case 'harvesting': {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        console.log(`Setting starter ${creep.name} to upgradingOrBuilding`);
        creep.memory.state = 'upgradingOrBuilding';
        return
      }
      const sources = creep.room.find(FIND_SOURCES);
      const harvestRes = creep.harvest(sources[0])
      if (harvestRes === ERR_NOT_IN_RANGE) {
        console.log(`Moving starter ${creep.name} to source`);
        creep.moveTo(sources[0]);
      } else if (harvestRes !== OK) {
        console.log(`Error harvesting: ${harvestRes} by ${creep.name}`);
      } else {
        console.log(`Harvested by ${creep.name}`);
        return
      }
    }
    case 'upgradingOrBuilding': {
      if (creep.store[RESOURCE_ENERGY] === 0) {
        console.log(`Setting starter ${creep.name} to harvesting`);
        creep.memory.state = 'harvesting';
        return
      }
      if (creep.room.controller?.level || 0 < 4) {
        console.log(`Setting starter ${creep.name} to upgrading`);
        const upgradeRes = creep.upgradeController(creep.room.controller as StructureController)
        if (upgradeRes === ERR_NOT_IN_RANGE) {
          console.log(`Moving starter ${creep.name} to controller`);
          creep.moveTo(creep.room.controller as StructureController);
          return
        } else if (upgradeRes !== OK) {
          console.log(`Error upgrading: ${upgradeRes} by ${creep.name}`);
        } else {
          console.log(`Upgraded by ${creep.name}`);
          return
        }
      } else {
        console.log(`Setting starter ${creep.name} to building`);
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
          const buildRes = creep.build(targets[0]);
          if (buildRes === ERR_NOT_IN_RANGE) {
            console.log(`Moving starter ${creep.name} to construction site`);
            creep.moveTo(targets[0]);
            return
          } else if (buildRes !== OK) {
            console.log(`Error building: ${buildRes} by ${creep.name}`);
          } else {
            console.log(`Built by ${creep.name}`);
            return
          }
        }
      }
    }
  }
}
