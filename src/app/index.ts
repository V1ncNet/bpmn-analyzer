import { ApplicationProperties } from '../lib/config';
import { ProcessImporter } from '../lib/import';

export class Application {

  private static _properties: ApplicationProperties;
  private static _importer: ProcessImporter;

  static async run(properties: ApplicationProperties) {
    console.log('started w/ properties', properties);

    Application._properties = properties;
    Application._importer = new ProcessImporter(this._properties);

    const models = await this._importer.import();
  }
}
