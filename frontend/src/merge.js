require('colors');
const Diff = require('diff');

const one = 'I have an cat and n';
const other = 'I have an cat and an <apple';

const diff = Diff.diffChars(one, other);

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  process.stderr.write(part.value[color]);
});
for (t; i < t.length; i++) {
  console.log(t);
  
}
console.log();