import { Model } from '../bpmn';
import { MtimeEnricher, ProcessAttributeEnricher } from './enrichers';
import { InformationEnricher } from './InformationEnricher';

export class EnrichmentService {

  private readonly enrichers: InformationEnricher[] = [
    MtimeEnricher,
    ProcessAttributeEnricher,
  ]

  async enrich(model: Model): Promise<void> {
    this.enrichers.forEach(async enricher => enricher.call(this, model));
  }
}
