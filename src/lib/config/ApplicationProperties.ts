import { PathLike } from 'fs';

export type ApplicationProperties = {
  basePath: PathLike;
  recursive?: boolean;
}
