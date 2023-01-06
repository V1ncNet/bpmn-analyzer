import { lstat } from 'fs/promises';
import { Model } from '../bpmn';
import { InformationEnricher } from './InformationEnricher';

export const MtimeEnricher: InformationEnricher = async (model: Model) => {
  const stat = await lstat(model.location);
  model.properties['mtime'] = stat.mtime;
}
