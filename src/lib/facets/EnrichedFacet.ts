import { AssignedValue } from './AssignedValue';
import { Value } from './Value';

export interface EnrichedFacet extends Value {
  readonly values: AssignedValue[];
}
