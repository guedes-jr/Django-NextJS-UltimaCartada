/** Pares sólidos do tema, sem inferir cascata ou layout renderizado.
 * Fórmula: https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
 * Limiares comparados sem arredondamento; números impressos são apenas relatório.
 */
import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('../src/components/consultoria/BrandTheme.module.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([,name,value]) => [name,value.trim()]));
function resolve(value, seen = new Set()) {
  if (value.startsWith('--')) {
    if (seen.has(value) || !tokens[value]) throw new Error(`Token inválido: ${value}`);
    return resolve(tokens[value], new Set([...seen, value]));
  }
  const alias = /^var\((--[\w-]+)\)$/.exec(value);
  if (alias) return resolve(alias[1], seen);
  if (!/^#[a-f\d]{6}$/i.test(value)) throw new Error(`Cor sólida inválida: ${value}`);
  return value;
}
function luminance(color) {
  const channels = [1,3,5].map(i => parseInt(color.slice(i,i+2),16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return channels.reduce((sum,c,i) => sum + c * [0.2126,0.7152,0.0722][i],0);
}
function ratio(a,b) {
  const [low,high] = [luminance(resolve(a)),luminance(resolve(b))].sort((x,y) => x-y);
  return (high + 0.05) / (low + 0.05);
}
// Referências independentes para detectar erro na implementação da fórmula.
if (ratio('#000000','#ffffff') !== 21 || ratio('#702c40','#702c40') !== 1) throw new Error('Referências de contraste inválidas');
const pairs = [
  ['Texto principal / marfim','--color-text','--color-bg',4.5],
  ['Texto principal / nude','--color-text','--color-surface-soft',4.5],
  ['Título / marfim','--color-heading','--color-bg',4.5],
  ['Título / nude','--color-heading','--color-surface-soft',4.5],
  ['Secundário / marfim','--color-muted','--color-bg',4.5],
  ['Secundário / nude','--color-muted','--color-surface-soft',4.5],
  ['Ação / vinho','--color-on-action','--color-action',4.5],
  ['Ação hover / ameixa','--color-on-action','--color-action-hover',4.5],
  ['Controle / marfim','--color-control-border','--color-surface',3],
  ['Controle / nude','--color-control-border','--color-surface-soft',3],
  ['Foco vinho / marfim','--color-focus','--color-bg',3],
  ['Foco vinho / nude','--color-focus','--color-surface-soft',3],
  ['Halo marfim / vinho','--color-focus-halo','--brand-wine',3],
  ['Halo marfim / ameixa','--color-focus-halo','--brand-plum',3],
  ['Erro / fundo claro','#b42318','#fff1f1',4.5],
  ['Sucesso / fundo claro','#28643b','#e6f4e7',4.5],
];
let failed = false;
for (const [label,a,b,minimum] of pairs) {
  const value = ratio(a,b);
  const pass = value >= minimum;
  if (!pass) failed = true;
  console.log(`${pass ? 'OK' : 'FALHA'} | ${label} | ${value.toFixed(2)}:1 | mínimo ${minimum}:1`);
}
console.log(`Restrições: rosé/marfim ${ratio('--brand-rose','--brand-ivory').toFixed(2)}:1; dourado/marfim ${ratio('--brand-gold','--brand-ivory').toFixed(2)}:1. Usar como decoração, sem texto pequeno.`);
console.log('Escopo: pares sólidos declarados; não verifica opacidade, imagens, cascata, foco real ou acessibilidade integral.');
process.exitCode = failed ? 1 : 0;
