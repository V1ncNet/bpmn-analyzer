import { Model } from '../bpmn';

export interface InformationEnricher {

  (model: Model): Promise<void>;
}
