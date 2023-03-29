import { DefineCommand, Command } from '@artus-cli/artus-cli';

@DefineCommand({
  command: '$0 dev [baseDir]',
})
export class DevCommand extends Command {
  async run() {
    console.info('hello');
  }
}
