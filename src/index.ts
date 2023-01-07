#!/usr/bin/env node

import { Application } from './app';
import { ConsoleConfigurator } from './lib/config/ConsoleConfigurator';

async function main() {
  ConsoleConfigurator.run();
  await Application.run(ConsoleConfigurator.properties);
}

main();
