import { CatchEvent, Process, ThrowEvent } from 'bpmn-moddle';
import { PathLike } from 'fs';
import { Model } from '../bpmn';
import { AssignedValue } from './AssignedValue';
import { Classification } from './Classification';
import * as root from './classification.json';
import { EnrichedFacet } from './EnrichedFacet';
import { Facet } from './Facet';
import { Value } from './Value';

export class FacetExtractor {

  private readonly _classification: Classification;

  constructor() {
    this._classification = root.classification as Classification;
  }

  extract(models: Model | Model[]): EnrichedFacet[] {
    return this._classification.facets.map(facet => {
      const values = facet.values.map(value => this.assign(models, value, facet));
      return { id: facet.id, name: facet.name, values };
    });
  }

  private assign(models: Model | Model[], value: Value, facet: Facet): AssignedValue {
    const locations = ((models instanceof Array) ? models : [models])
      .map(model => {
        const location = model.location;

        const id = value.id === '@default'
          ? facet.id
          : value.id

        const elements = model.definitions.rootElement.rootElements;
        const process = elements.find(element => element.$type === 'bpmn:Process') as Process;
        const flowElements = process.flowElements;

        return flowElements.some(element => {
          if ((element as any).eventDefinitions) {
            const event = element as ThrowEvent | CatchEvent;
            return facet.id === event.$type && event.eventDefinitions.some(def => def.$type === id);
          }

          return element.$type === id;
        }) ? location : null
      })
      .filter(location => location)
      .map(location => { return location as PathLike }); // non-null list of models that contains the facet value

    return { ...value, locations };
  }
}
