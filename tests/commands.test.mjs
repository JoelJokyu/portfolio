import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveCommand } from '../src/commands.ts';

const projects = [
  { id: 'rt-chat', name: 'RT Chat', repository: 'https://github.com/JoelJokyu/rt-chat' },
  { id: 'private-project', name: 'Private project' },
  { id: 'eventapp', name: 'EventApp', tutorial: 'https://youtu.be/ERZadn9artM' },
];
test('playful commands remain local and validate guesses', () => {
  for (const command of ['hello', 'bye', 'ping', 'coffee', 'fortune', 'ip']) assert.equal(resolveCommand(command, projects).type, 'message');
  assert.equal(resolveCommand('time', projects).type, 'clock');
  assert.deepEqual(resolveCommand('game', projects), { type: 'game' });
  assert.deepEqual(resolveCommand('guess 50', projects), { type: 'game', guess: 50 });
  assert.deepEqual(resolveCommand('game stop', projects), { type: 'game', stop: true });
  for (const command of ['guess 0', 'guess 101', 'guess -1', 'guess 1.5', 'guess NaN', 'guess 2 extra']) assert.equal(resolveCommand(command, projects).type, 'message');
});
test('source flags and IDs resolve only curated links', () => {
  for (const command of ['open 1 -source', 'OPEN RT-CHAT --SOURCE']) {
    assert.equal(resolveCommand(command, projects).url, projects[0].repository);
  }
  assert.equal(resolveCommand('open 3 --tutorial', projects).url, projects[2].tutorial);
});
test('private projects never expose a source URL', () => {
  const result = resolveCommand('open 2 --source', projects);
  assert.equal(result.type, 'message');
  assert.match(result.message, /not public/);
});
test('malformed commands and arbitrary URLs cannot launch links', () => {
  for (const command of ['open 1 --bad', 'open 1 --source extra', 'open https://example.com --source', 'open', '__proto__', 'constructor', 'cat __proto__']) {
    assert.equal(resolveCommand(command, projects).type, 'message');
  }
});
test('navigation aliases and portfolio files work', () => {
  assert.deepEqual(resolveCommand(' ls -la ', projects), { type: 'view', view: 'projects' });
  assert.deepEqual(resolveCommand('cat skills.txt', projects), { type: 'view', view: 'about' });
  assert.deepEqual(resolveCommand('open 1', projects), { type: 'view', view: 'projects', projectId: 'rt-chat' });
  assert.equal(resolveCommand('history', projects).type, 'history');
});
