import { Process, RootElement } from 'bpmn-moddle';
import { lstat } from 'fs/promises';
import { Model } from '../bpmn';
import { InformationEnricher } from './InformationEnricher';

export const MtimeEnricher: InformationEnricher = async (model: Model) => {
  const stat = await lstat(model.location);
  model.properties['mtime'] = stat.mtime;
}

export const ProcessAttributeEnricher: InformationEnricher = async (model: Model) => {
  const elements = rootElements(model);
  const process = findProcessIn(elements);
  const flowElements = process.flowElements;

  model.properties['complexity'] = flowElements.length;
  model.properties['processId'] = process.id;
  model.properties['executable'] = process.isExecutable || false;
}

function rootElements(model: Model): any[] {
  return model.definitions.rootElement.rootElements;
}

function findProcessIn(elements: RootElement[]): Process {
  return elements.find(element => element.$type === 'bpmn:Process') as Process;
}
