require('colors');
const Diff = require('diff');

const one = '利用我们的机器翻译后期编辑服务（MTPE），确保你的项目翻译得完美无缺。无论您是依靠我们的MT还是您的内部MT，我们的PE流程都是为了检测和编辑任何错误。轻度后期编辑主要由人类语言学家参与，用于翻译好的文本和轻微错误。全面的后期编辑涉及语言学家和学科专家，他们审查您的内容，以确保尽可能高的质量。';
const other = '利用我们的机器翻译译后编辑服务 (MTPE) 确保您的项目得到完美翻译。无论您是依赖我们的 MT 还是您的内部 MT，我们的 PE 流程都旨在检测和编辑任何错误。轻型译后编辑主要涉及人类语言学家，以翻译翻译良好且有小错误的文本。完整的后期编辑涉及语言学家和学科专家，他们会审查您的内容以确保尽可能高的质量。';

const diff = Diff.diffChars(one, other);

diff.forEach((part) => {
  // green for additions, red for deletions
  // grey for common parts
  const color = part.added ? 'green' :
    part.removed ? 'red' : 'grey';
  process.stderr.write(part.value[color]);
});
// for (t; i < t.length; i++) {
//   console.log(t);
  
// }
// console.log();