import { Model } from '../bpmn';

export class KeywordFilter {

  public byKeywords(keywords: string[]): (value: Model) => boolean {
    return (model) => {
      const elements = model.definitions.rootElement.rootElements;
      const candidates = [...this.find(elements, 'name'), ...this.find(elements, 'text')]
        .flatMap(label => label.split(' '))
        .map(label => label.toLowerCase())

      const nonNullKeywords = keywords.filter(keyword => keyword);
      if (nonNullKeywords.length < 1) {
        return true;
      }

      return candidates
        .some(word => nonNullKeywords
          .filter(keyword => keyword)
          .some(keyword => word.includes(keyword.toLowerCase())));
    }
  }

  private find(object: any, property: string, result: string[] = []): string[] {
    const r = result;
    Object.keys(object).forEach(key => {
      const value = object[key];
      if (key === property && typeof value !== 'object') {
        r.push(value);
      } else if (typeof value === 'object') {
        this.find(value, property, r);
      }
    });

    return r;
  }
}
