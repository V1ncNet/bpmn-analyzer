import { Command } from 'commander';
import { resolve } from 'path';
import { ApplicationProperties } from './ApplicationProperties';

export class ConsoleConfigurator {

  public static properties: ApplicationProperties;

  public static run() {
    const program = new Command();

    program
      .name('bpmn-analyzer')
      .description('CLI zur Analyse von Beziehungen und Abhängigkeiten zwischen BPMN-Modellen');

    program
      .option('-p, --path <pfad>', 'Speicherort der BPMN-Modellen', './')
      .option('-r, --recursive', 'Konfiguriert, ob [pfad] rekursiv durchsucht werden soll')
      .option('-s, --search <stichwort...>', 'Filtert die Eingabe anhand der angegebenen Schlüsselwörter');

    program.parse();

    const options = program.opts();
    const basePath = resolve(options['path']);

    ConsoleConfigurator.properties = {
      basePath,
      recursive: options['recursive'] || false,
      keywords: options['search']
    };
  }
}
