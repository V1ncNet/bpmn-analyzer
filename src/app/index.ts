import { ApplicationProperties } from '../lib/config';
import { FacetExtractor } from '../lib/facets';
import { ProcessImporter } from '../lib/import';

export class Application {

  private static _properties: ApplicationProperties;
  private static _importer: ProcessImporter;
  private static _facetExtractor: FacetExtractor;

  static async run(properties: ApplicationProperties) {
    console.log('started w/ properties', properties);

    Application._properties = properties;
    Application._importer = new ProcessImporter(this._properties);
    Application._facetExtractor = new FacetExtractor();

    const models = await this._importer.import();
    const facets = this._facetExtractor.extract(models);
  }
}
