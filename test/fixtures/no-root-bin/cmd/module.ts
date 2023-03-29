import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: '$0 module dev [baseDir]',
})
export class ModuleDevCommand extends Command {
  async run() {
    console.info('hello');
  }
}

@DefineCommand({
  command: '$0 module debug [baseDir]',
})
export class ModuleDebugCommand extends Command {
  async run() {
    console.info('hello');
  }
}
