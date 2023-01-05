#!/usr/bin/env node

import { Command } from 'commander';
import { resolve } from 'path';
import { Application } from './app';
import { ApplicationProperties } from './lib/config';

async function main() {
  const programm = new Command();

  programm
    .name('bpmn-analyzer')
    .description('CLI for analying relationships and dependecies between BPMN models');

  const options = programm.opts();
  const [path] = programm.args;
  const basePath = resolve(path ?? './');

  const properties: ApplicationProperties = {
    basePath,
    recursice: options['r'] || false,
  };

  await Application.run(properties);
}

main();
