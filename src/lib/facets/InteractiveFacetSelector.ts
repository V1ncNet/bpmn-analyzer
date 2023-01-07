import inquirer from 'inquirer';
import { PopulatedFacet } from '.';

export class InteractiveFacetSelector {

  async filter(facets: PopulatedFacet[]): Promise<PopulatedFacet[]> {
    const choices = facets
      .flatMap(facet => {
        const clazz = new inquirer.Separator(facet.name);
        const options = facet.values
          .filter(value => value.locations.length != 0)
          .map(val => {
            return { name: val.name, value: `${facet.id}.${val.id}` }
          })
        return [clazz, ...options]
      });

    const answer = await inquirer.prompt([{
      type: 'checkbox',
      message: 'Facettennavigation',
      name: 'result',
      choices,
    }]);

    return answer.result.flatMap((property: string) => {
      const [facetId, valueId] = property.split('.');
      return facets
        .filter(facet => facet.id === facetId)
        .flatMap(facet => {
          const selected = facet.values.filter(value => value.id === valueId);
          return { ...facet, values: selected }
        })
    });
  }
}
