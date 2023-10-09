import { writeFile } from 'fs/promises';

async function main() {
  let url =
    'https://lh3.googleusercontent.com/places/ANXAkqG5SPwJG97UKfejcbJr0ez9M0FITYgJVklTl62xnRDjfC6Obr0gZKXN1zYH7KFq2Ml83nOQtVtCKpKT0tKgETZ16XPKcwkpsgs=s1600-w400';
  let res = await fetch(url);
  let bin = await res.arrayBuffer();
  let buffer = Buffer.from(bin);
  await writeFile('sample.jpg', buffer);
}
main();
