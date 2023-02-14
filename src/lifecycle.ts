import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, Program, CommandContext, Utils, ArtusCliError } from '@artus-cli/artus-cli';

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
      if (ctx.fuzzyMatched && ctx.args.help) {
        // redirect to help command
        const utils = ctx.container.get(Utils);
        return utils.redirect([ 'help', ctx.fuzzyMatched.uid ]);
      }

      try {
        await next();
      } catch(e) {
        if (e instanceof ArtusCliError) {
          // built-in error in artus-cli
          console.error(`\n ${e.message}, try '${ctx.fuzzyMatched.cmds.join(' ') || bin} --help' for more information.\n`);
          process.exit(1);
        }

        throw e;
      }
    });
  }
}
