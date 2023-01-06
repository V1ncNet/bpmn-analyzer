import { PathLike } from 'fs';
import { Value } from './Value';

export interface AssignedValue extends Value {
  locations: PathLike[]
}
