import { ApplicationProperties } from '../lib/config';

export class Application {

  private static _properties: ApplicationProperties;

  static async run(properties: ApplicationProperties) {
    console.log('started w/ properties', properties);

    Application._properties = properties;
  }
}
