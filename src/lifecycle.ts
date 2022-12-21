import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Program, CommandContext, Utils } from '@artus-cli/artus-cli';

@LifecycleHookUnit()
export default class UsageLifecycle implements ApplicationLifecycle {
  @Inject()
  private readonly program: Program;

  @LifecycleHook()
  async configDidLoad() {
    // add global options
    this.program.option({
      help: {
        type: 'boolean',
        description: 'Show Help',
        alias: 'h',
      },
    });

    this.program.use(async (ctx: CommandContext, next) => {
      const { binName: bin } = this.program;
      const { fuzzyMatched, matched, args, raw } = ctx;
      if (!fuzzyMatched || !args.help) {
        if (!matched) {
          // can not match any command
          console.error(`\n Command not found: '${bin} ${raw.join(' ')}', try '${fuzzyMatched?.cmds.join(' ') || bin} --help' for more information.\n`);
          process.exit(1);
        }

        return await next();
      }

      // redirect to help command
      const utils = ctx.container.get(Utils);
      await utils.redirect([ 'help', fuzzyMatched.uid ]);
    });
  }
}
