console.log('RESTED!!!')
import { calcSpawnPlanForRoom } from "spawnPlan";
import { ErrorMapper } from "utils/ErrorMapper";
import { ruleRunner } from "role";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    state: string;
    targetId: string | null;
    // working: boolean;
  }

  interface RoomMemory {
    sources: { [key: string]: { maxHarvesterNum:number}}
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // update room info
  // for (const roomName in Game.rooms) {
  //   if (!Game.rooms[roomName].controller?.my) {
  //     continue;
  //   }
  //   const room = Game.rooms[roomName];
  //   const sources = room.find(FIND_SOURCES);
  //   for (const i in sources) {
  //     const source = sources[i];
  //     if (!room.memory.sources) {
  //       room.memory.sources = {};
  //     }
  //     if (!room.memory.sources[source.id]) {
  //       const maxHarvesterNum = source.pos.findInRange(FIND_, 1).length;
  //       room.memory.sources[source.id] = {
  //         maxHarvesterNum
  //       };
  //     }
  //   }
  // }

  // spawn creeps for every room
  for (const roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    const spawn = room.find(FIND_MY_SPAWNS)[0];
    if (!spawn) {
      continue;
    }

    const spawnPlans = calcSpawnPlanForRoom(roomName);
    for (const spawnPlan of spawnPlans) {
      const res = spawn.spawnCreep(spawnPlan.body, `${spawnPlan.role}-${Game.time}`, {
        memory: {
          role: spawnPlan.role || '',
          room: roomName,
          state: 'init',
          targetId: null
          // working: false,
        },
      });
      if (res === OK) {
        console.log(`Spawning ${spawnPlan.role} in ${roomName}`);
      }
    }
  }

  // run creeps
  for (const creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    if (creep.spawning) {
      continue;
    }

    const role = creep.memory.role;
    if (!role) {
      console.log(`Creep ${creepName} has no role, setting to starter`);
      creep.memory.role = 'starter';
      creep.memory.state = 'init';
      continue;
    }

    const runner = ruleRunner[role];
    runner(creep);
  }

  // Generate pixel
  if (Game.cpu.bucket = 10000) {
    Game.cpu.generatePixel();
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
