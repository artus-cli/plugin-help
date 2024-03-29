import { Option, DefineCommand, Command, Inject, CommandContext, Program } from '@artus-cli/artus-cli';
import commandLineUsage from 'command-line-usage';

@DefineCommand({
  command: 'help [command]',
  description: 'show help infomation for command',
  alias: 'h',
})
export class HelpCommand extends Command {
  @Inject()
  ctx: CommandContext;

  @Inject()
  program: Program;

  @Option()
  command: string;

  async run() {
    const ctx = this.ctx;
    const { binName: bin } = this.program;
    const command = this.command || bin;
    const commandUid = command.startsWith(bin) ? command : `${bin} ${command}`;
    const helpCommand = ctx.commands.get(commandUid) || ctx.rootCommand;

    // display help informations
    const displayTexts: string[] = [];
    const commandLineUsageList: any[] = [];
    const optionKeys = helpCommand.options ? Object.keys(helpCommand.options) : [];

    // usage info in first line
    displayTexts.push(
      'Usage: ' +
      (helpCommand.command.startsWith(bin) ? '' : `${bin} `) +
      helpCommand.command +
      (helpCommand.isRunable ? '' : ' <cmd>'),
    );

    if (helpCommand.description) {
      displayTexts.push('', helpCommand.description);
    }

    // show examples
    if (helpCommand.examples?.length) {
      commandLineUsageList.push({
        header: 'Examples',
        content: helpCommand.examples
          .map(info => (
            (info.description ? `# ${info.description}\n` : '') +
            info.command
          ))
          .join('\n\n'),
      });
    }

    // available commands, display all subcommands if match the root command
    const availableCommands = (
      helpCommand.isRoot
        ? Array.from(new Set(ctx.commands.values()))
        : helpCommand.childs || []
    ).filter(c => !c.isRoot && c.isRunable);

    if (availableCommands.length) {
      commandLineUsageList.push({
        header: 'Available Commands',
        content: availableCommands.map(command => ({
          name: command.command,
          summary: command.description,
        })),
      });
    }

    // options list, like -h, --help / -v, --version ...
    commandLineUsageList.push({
      header: 'Options',
      optionList: optionKeys
        .map(flag => {
          const option = helpCommand.options[flag];
          const showFlag = flag[0].toLowerCase() + flag.substring(1).replace(/[A-Z]/g, '-$&').toLowerCase();
          return {
            name: showFlag,
            type: { name: option.type || 'string' },
            description: option.description,
            alias: option.alias,
            defaultValue: option.default,
          };
        }),
    });

    // use command-line-usage to format help informations.
    displayTexts.push(commandLineUsage(commandLineUsageList));
    console.info(displayTexts.join('\n'));
  }
}
