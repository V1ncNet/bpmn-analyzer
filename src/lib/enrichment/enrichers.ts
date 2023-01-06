import { Process } from 'bpmn-moddle';
import { lstat } from 'fs/promises';
import { Model } from '../bpmn';
import { InformationEnricher } from './InformationEnricher';

export const MtimeEnricher: InformationEnricher = async (model: Model) => {
  const stat = await lstat(model.location);
  model.properties['mtime'] = stat.mtime;
}

export const ComplexityEnricher: InformationEnricher = async (model: Model) => {
  const elements: any[] = model.definitions.rootElement.rootElements;
  const process: Process = elements.find(element => element.$type === 'bpmn:Process');
  const flowElements = process.flowElements;
  model.properties['complexity'] = flowElements.length;
}

export const ProcessIdEnricher: InformationEnricher = async (model: Model) => {
  const elements: any[] = model.definitions.rootElement.rootElements;
  const process: Process = elements.find(element => element.$type === 'bpmn:Process');
  model.properties['processId'] = process.id;
}
