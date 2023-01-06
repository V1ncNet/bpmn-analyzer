import { Definitions } from 'bpmn-moddle';
import { PathLike } from 'fs';

export type Model = {
  location: PathLike;
  definitions: Definitions;
}
