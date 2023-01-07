import { Model } from '../lib/bpmn';
import { ApplicationProperties } from '../lib/config';
import { EnrichmentService } from '../lib/enrichment';
import { FacetExtractor } from '../lib/facets';
import { InteractiveFacetSelector, KeywordFilter } from '../lib/filter';
import { ProcessImporter } from '../lib/import';

export class Application {

  private static _properties: ApplicationProperties;
  private static _enrichmentService: EnrichmentService;
  private static _importer: ProcessImporter;
  private static _facetExtractor: FacetExtractor;
  private static _selector: InteractiveFacetSelector;
  private static _keywordFilter: KeywordFilter;

  static async run(applicationProperties: ApplicationProperties) {
    Application._properties = applicationProperties;
    Application._enrichmentService = new EnrichmentService()
    Application._importer = new ProcessImporter(this._properties, this._enrichmentService);
    Application._facetExtractor = new FacetExtractor();
    Application._selector = new InteractiveFacetSelector()
    Application._keywordFilter = new KeywordFilter();

    const models = (await this._importer.import()).filter(this._keywordFilter.byKeywords(this._properties.keywords));
    const facets = this._facetExtractor.extract(models);
    const selected = await this._selector.filter(facets);

    const result = selected
      .flatMap(selection => selection.values.flatMap(value => value.locations))
      .map(location => models.find(model => model.location === location))
      .map(model => {
        const { definitions, ...result } = model as Model;
        return result;
      });

    console.log(JSON.stringify(this.uniqBy(result, model => String(model.location)), null, '  '));
  }

  private static uniqBy<T>(array: T[], key: (item: T) => string) {
    const seen: any = {};
    return array.filter(item => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
  }
}
