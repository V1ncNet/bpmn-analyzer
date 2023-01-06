#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { Application } from './app';
import { ApplicationProperties } from './lib/config';

async function main() {
  const program = new Command();

  program
    .name('bpmn-analyzer')
    .description('CLI zur Analyse von Beziehungen und Abhängigkeiten zwischen BPMN-Modellen');

  program
    .option('-p, --path <pfad>', 'Speicherort der BPMN-Modellen', './')
    .option('-r, --recursive', 'Konfiguriert, ob [pfad] rekursiv durchsucht werden soll');

  program.parse();

  const options = program.opts();
  const basePath = resolve(options['path']);

  const properties: ApplicationProperties = {
    basePath,
    recursice: options['r'] || false,
  };

  await Application.run(properties);
}

main();
