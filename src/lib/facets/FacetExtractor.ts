import { CatchEvent, Message, Process, Signal, ThrowEvent } from 'bpmn-moddle';
import { PathLike } from 'fs';
import { Model } from '../bpmn';
import { AssignedValue } from './AssignedValue';
import { Classification } from './Classification';
import * as root from './classification.json';
import { Facet } from './Facet';
import { PopulatedFacet } from './PopulatedFacet';
import { Value } from './Value';

export class FacetExtractor {

  private readonly _classification: Classification;

  constructor() {
    this._classification = root.classification as Classification;
  }

  extract(models: Model | Model[]): PopulatedFacet[] {
    return this._classification.facets.map(facet => {
      const signals: AssignedValue[] = this.extractSignals(facet, models);
      const messages: AssignedValue[] = this.extractMessages(facet, models);
      const values = facet.values.map(value => this.assign(models, value, facet));
      return { id: facet.id, name: facet.name, values: [...signals, ...messages, ...values] };
    });
  }

  private extractSignals(facet: Facet, models: Model | Model[]) {
    const signals: AssignedValue[] = [];
    if (facet.id === "bpmn:Signal") {
      ((models instanceof Array) ? models : [models])
        .map(model => {
          const elements: any[] = model.definitions.rootElement.rootElements;
          const candidates: Signal[] = elements.filter(element => element.$type === 'bpmn:Signal');

          candidates.forEach(candidate => {
            const existing = signals.find(signal => signal.id === candidate.name);
            if (existing) {
              existing.locations.push(model.location);
            } else {
              signals.push({
                id: candidate.name,
                name: candidate.name,
                locations: [model.location]
              });
            }
          });
        });
    }
    return signals;
  }

  private extractMessages(facet: Facet, models: Model | Model[]) {
    const messages: AssignedValue[] = [];
    if (facet.id === "bpmn:Message") {
      ((models instanceof Array) ? models : [models])
        .map(model => {
          const elements: any[] = model.definitions.rootElement.rootElements;
          const candidates: Message[] = elements.filter(element => element.$type === 'bpmn:Message');

          candidates.forEach(candidate => {
            const existing = messages.find(message => message.id === candidate.name);
            if (existing) {
              existing.locations.push(model.location);
            } else {
              messages.push({
                id: candidate.name,
                name: candidate.name,
                locations: [model.location]
              });
            }
          });
        });
    }
    return messages;
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
