import { run } from './test-utils';

describe('test/index.test.ts', () => {
  it('should --help', async () => {
    await run('my-bin', '--help')
      // .debug()
      .expect('stdout', /Usage: my-bin/)
      .expect('stdout', /Available Commands/)
      .expect('stdout', /help \[command\]\s+show help infomation for command/)
      .expect('stdout', /test \<baseDir\> \[file\.\.\.\]\s+Run the unitest/)
      .expect('stdout', /cov \<baseDir\> \[file\.\.\.\]\s+Run the coverage/)
      .expect('stdout', /dev \[baseDir\]\s+Run the development server/)
      .expect('stdout', /debug \[baseDir\]\s+Run the development server at debug mode/)
      .expect('stdout', /Options/)
      .expect('stdout', /-h, --help\s+Show Help/)
      .end();
  });

  it('should subcommand --help', async () => {
    await run('my-bin', 'dev -h')
      .debug()
      .expect('stdout', /Available Commands/)
      .notExpect('stdout', /help \[command\]\s+show help infomation for command/)
      .notExpect('stdout', /test \<baseDir\> \[file\.\.\.\]\s+Run the unitest/)
      .notExpect('stdout', /cov \<baseDir\> \[file\.\.\.\]\s+Run the coverage/)
      .expect('stdout', /dev \[baseDir\]\s+Run the development server/)
      .expect('stdout', /Options/)
      .expect('stdout', /--inspect\s+Debug with node-inspector/)
      .expect('stdout', /--node-flags string/)
      .expect('stdout', /-h, --help\s+Show Help/)
      .end();
  });

  it('should use help command', async () => {
    await run('my-bin', 'help')
      // .debug()
      .expect('stdout', /Available Commands/)
      .expect('stdout', /help \[command\]\s+show help infomation for command/)
      .expect('stdout', /test \<baseDir\> \[file\.\.\.\]\s+Run the unitest/)
      .expect('stdout', /cov \<baseDir\> \[file\.\.\.\]\s+Run the coverage/)
      .expect('stdout', /dev \[baseDir\]\s+Run the development server/)
      .expect('stdout', /debug \[baseDir\]\s+Run the development server at debug mode/)
      .expect('stdout', /Options/)
      .expect('stdout', /-h, --help\s+Show Help/)
      .end();

    await run('my-bin', 'help dev')
      // .debug()
      .expect('stdout', /Available Commands/)
      .notExpect('stdout', /help \[command\]\s+show help infomation for command/)
      .notExpect('stdout', /test \<baseDir\> \[file\.\.\.\]\s+Run the unitest/)
      .notExpect('stdout', /cov \<baseDir\> \[file\.\.\.\]\s+Run the coverage/)
      .expect('stdout', /dev \[baseDir\]\s+Run the development server/)
      .expect('stdout', /Options/)
      .expect('stdout', /--inspect\s+Debug with node-inspector/)
      .expect('stdout', /--node-flags string/)
      .expect('stdout', /-h, --help\s+Show Help/)
      .end();
  });

  it('should show help info when throw built-in error', async () => {
    await run('my-bin', 'notexistscommand -h')
      .debug()
      .expect('stderr', /Command is not found/)
      .expect('stderr', /notexistscommand/)
      .expect('stderr', /try 'my-bin --help' for more information/)
      .end();

    await run('my-bin', 'dev abc bbc')
      .debug()
      .expect('stderr', /Command is not found/)
      .expect('stderr', /bbc/)
      .expect('stderr', /try 'my-bin dev --help' for more information/)
      .end();

    await run('my-bin', 'dev abc --bbc')
      .debug()
      .expect('stderr', /Unknown options: --bbc/)
      .expect('stderr', /try 'my-bin dev --help' for more information/)
      .end();
  });

  it('should not show help info when throw custom error', async () => {
    await run('my-bin', 'dev --throw')
      .debug()
      .expect('stderr', /custom error/)
      .expect('stderr', /my-bin[\/\\]cmd[\/\\]dev\.ts:\d+:\d+/)
      .notExpect('stderr', /try 'my-bin dev --help' for more information/)
      .end();
  });

  it('should show help in extends command without error', async () => {
    await run('other-bin', '-h')
      // .debug()
      .expect('stdout', /Usage: other-bin/)
      .expect('stdout', /Available Commands/)
      .expect('stdout', /help \[command\]\s+show help infomation for command/)
      .expect('stdout', /test \<baseDir\> \[file\.\.\.\]\s+Run the unitest/)
      .expect('stdout', /cov \<baseDir\> \[file\.\.\.\]\s+Run the coverage/)
      .expect('stdout', /dev \[baseDir\]\s+Run the development server/)
      .expect('stdout', /debug \[baseDir\]\s+Run the development server at debug mode/)
      .expect('stdout', /Options/)
      .expect('stdout', /-h, --help\s+Show Help/)
      .end();
  });
});
