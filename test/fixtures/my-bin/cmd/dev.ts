import { DefineCommand, Command, Option } from '@artus-cli/artus-cli';

@DefineCommand({
  command: 'dev [baseDir]',
  description: 'Run the development server',
  examples: [
    [ '$0 dev ./', 'Run in base dir' ],
    [ '$0 dev ./ --port=3000', 'Run with port' ],
    [ '$0 dev ./ --debug' ],
  ],
  alias: [ 'd' ],
})
export class DevCommand extends Command {
  @Option({
    alias: 'p',
    default: 3000,
    description: 'Start A Server',
  })
  port: number;

  @Option({
    default: false,
    description: 'Debug with node-inspector',
  })
  inspect: boolean;

  @Option({
    default: false,
  })
  throw: boolean;

  @Option()
  nodeFlags: string;

  async run() {
    if (this.throw) {
      throw new Error('custom error');
    }
  }
}
