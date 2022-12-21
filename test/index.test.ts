import { run } from './test-utils';

describe('test/index.test.ts', () => {
  it('should --help', async () => {
    await run('egg-bin', '--help')
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
  });

  it('should subcommand --help', async () => {
    await run('egg-bin', 'dev -h')
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
    await run('egg-bin', 'help')
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

    await run('egg-bin', 'help dev')
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

  it('should show command not found', async () => {
    await run('egg-bin', 'notexistscommand -h')
      // .debug()
      .expect('stderr', /Command not found: 'egg-bin notexistscommand -h'/)
      .expect('stderr', /try 'egg-bin --help' for more information/)
      .end();

    await run('egg-bin', 'dev abc bbc')
      // .debug()
      .expect('stderr', /Command not found: 'egg-bin dev abc bbc'/)
      .expect('stderr', /try 'egg-bin dev --help' for more information/)
      .end();
  });
});
