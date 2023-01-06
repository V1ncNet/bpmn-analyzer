import { AssignedValue } from './AssignedValue';
import { Value } from './Value';

export interface PopulatedFacet extends Value {
  readonly values: AssignedValue[];
}
