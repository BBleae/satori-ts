export type RoleName =
  | 'harvester'
  | 'controllerOperator'
  | 'builder'
  | 'repairer'
  | 'wallRepairer'
  | 'starter'

import {run as starter} from './starter'

export const ruleRunner: { [key: string]: (creep: Creep) => void } = {
  starter
}
