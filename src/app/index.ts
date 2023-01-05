import { ApplicationProperties } from '../lib/config';

export class Application {

  static async run(properties: ApplicationProperties) {
    console.log('started w/ properties', properties);
  }
}
