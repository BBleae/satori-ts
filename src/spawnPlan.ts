import type { RoleName } from "role";

export interface SpawnPlan {
  body: BodyPartConstant[];
  role?: RoleName;
}

export function calcSpawnPlanForRoom(roomId: string): SpawnPlan[] {
  const room = Game.rooms[roomId];
  if (!room) {
    return [];
  }

  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn) {
    return [];
  }

  const energyCapacity = room.energyCapacityAvailable;
  const energyAvailable = room.energyAvailable;

  const spawnPlans: SpawnPlan[] = [];

  if ((room.controller?.level || 0) < 4) {
    spawnPlans.push({
      body: calcParts(energyCapacity, 'starter'),
      role: 'starter',
    });
  }

  return spawnPlans;
}

export function calcParts(energy: number, role: RoleName) {
  switch (role) {
    default:
    case 'starter': {
      const parts: BodyPartConstant[] = [WORK, CARRY, MOVE, WORK];
      // let energyLeft = energy - calcEnergy(parts);
      return parts;
    }
  }
}

export function calcEnergy(parts: BodyPartConstant[]) {
  return parts.reduce((sum, part) => sum + BODYPART_COST[part], 0);
}
