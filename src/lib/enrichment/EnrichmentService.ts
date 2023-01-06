import { Model } from '../bpmn';
import { InformationEnricher } from './InformationEnricher';

export class EnrichmentService {

  private readonly enrichers: InformationEnricher[] = [
  ]

  async enrich(model: Model): Promise<void> {
    this.enrichers.forEach(async (enricher: InformationEnricher) => enricher.call(this, model));
  }
}
