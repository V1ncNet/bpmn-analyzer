import { ApplicationProperties } from '../lib/config';
import { EnrichmentService } from '../lib/enrichment';
import { FacetExtractor } from '../lib/facets';
import { InteractiveFacetSelector } from '../lib/filter';
import { ProcessImporter } from '../lib/import';

export class Application {

  private static _properties: ApplicationProperties;
  private static _enrichmentService: EnrichmentService;
  private static _importer: ProcessImporter;
  private static _facetExtractor: FacetExtractor;
  private static _selector: InteractiveFacetSelector;

  static async run(properties: ApplicationProperties) {
    Application._properties = properties;
    Application._enrichmentService = new EnrichmentService()
    Application._importer = new ProcessImporter(this._properties, this._enrichmentService);
    Application._facetExtractor = new FacetExtractor();
    Application._selector = new InteractiveFacetSelector()

    const models = await this._importer.import();
    const facets = this._facetExtractor.extract(models);
    const selected = await this._selector.filter(facets);

    console.log(JSON.stringify(selected, null, '  '));
  }
}
