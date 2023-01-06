import BPMNModdle from 'bpmn-moddle';
import fs, { PathLike } from 'fs';
import { resolve } from 'path';
import { Model } from '../bpmn';
import { ApplicationProperties } from '../config';
import { EnrichmentService } from '../enrichment';

export class ProcessImporter {

  constructor(private _properties: ApplicationProperties, private _enrichmentService: EnrichmentService) { }

  async import(): Promise<Model[]> {
    const bpmnFiles = await this.readBpmnFiles(this._properties.basePath);
    const models = bpmnFiles.map(async location => {
      const moddle = new BPMNModdle();
      const bpmn = await fs.promises.readFile(location, { encoding: 'utf8' });
      const definitions = await moddle.fromXML(bpmn);

      const model = {
        location,
        definitions,
        properties: {}
      } as Model;

      await this._enrichmentService.enrich(model);
      return model;
    });

    return Promise.all(models);
  }

  private async readBpmnFiles(location: PathLike): Promise<string[]> {
    return (await fs.promises.readdir(location, { withFileTypes: true }))
      .filter(dirent => !dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(filename => filename.endsWith('.bpmn'))
      .map(filename => resolve(String(location), filename));
  }
}
