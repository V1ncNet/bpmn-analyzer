import { Model } from '../bpmn';
import { MtimeEnricher } from './enrichers';
import { InformationEnricher } from './InformationEnricher';

export class EnrichmentService {

  private readonly enrichers: InformationEnricher[] = [
    MtimeEnricher,
  ]

  async enrich(model: Model): Promise<void> {
    this.enrichers.forEach(async (enricher: InformationEnricher) => enricher.call(this, model));
  }
}
