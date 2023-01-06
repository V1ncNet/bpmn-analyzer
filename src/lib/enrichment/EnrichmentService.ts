import { Model } from '../bpmn';
import { ComplexityEnricher, MtimeEnricher, ProcessIdEnricher } from './enrichers';
import { InformationEnricher } from './InformationEnricher';

export class EnrichmentService {

  private readonly enrichers: InformationEnricher[] = [
    MtimeEnricher,
    ComplexityEnricher,
    ProcessIdEnricher,
  ]

  async enrich(model: Model): Promise<void> {
    this.enrichers.forEach(async (enricher: InformationEnricher) => enricher.call(this, model));
  }
}
