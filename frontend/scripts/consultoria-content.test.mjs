import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/consultoria/content.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
function content(env = {}) {
  const exports = {};
  vm.runInNewContext(code, { exports, module: { exports }, process: { env }, URL });
  return exports;
}
test('dados ausentes mantêm placeholders e não ativam destinos', () => {
  const c = content();
  assert.ok(Object.values(c.consultoriaOfferDetails).every(value => value === 'A confirmar'));
  assert.equal(c.getConsultoriaContact(), null);
  assert.equal(c.getHerbalifeContact(), null);
  assert.equal(c.getConsultoriaInstagram(), null);
  assert.equal(c.getConsultoriaProfessionalIdentity(), null);
});
test('fatos configurados alimentam condições, FAQ e painel como texto literal', () => {
  const c = content({ CONSULTORIA_MENTORSHIP_DURATION: ' Duração aprovada de teste ', CONSULTORIA_PROFESSIONAL_IDENTITY: ' Identificação de teste <texto> ' });
  assert.equal(c.consultoriaOfferDetails.mentorshipDuration, 'Duração aprovada de teste');
  assert.ok(c.sharedQuestions.some(item => item.answer.includes('Duração aprovada de teste')));
  assert.ok(c.consultoriaPendingDetails.some(item => item.value === 'Duração aprovada de teste'));
  assert.equal(c.getConsultoriaProfessionalIdentity(), 'Identificação de teste <texto>');
});
test('WhatsApp rejeita texto, sinal, URL e número curto', () => {
  for (const value of ['abc', '+5511999999999', 'https://wa.me/5511999999999', '123', '0'.repeat(12)]) {
    assert.equal(content({ CONSULTORIA_WHATSAPP_NUMBER: value }).getConsultoriaContact(), null);
  }
});
test('WhatsApp preserva o destino e codifica mensagem por assunto', () => {
  const c = content({ CONSULTORIA_WHATSAPP_NUMBER: '5511999999999' });
  const mentor = new URL(c.getConsultoriaContact());
  const game = new URL(c.getConsultoriaContact('game'));
  assert.equal(mentor.hostname, 'wa.me');
  assert.equal(mentor.pathname, '/5511999999999');
  assert.match(mentor.searchParams.get('text'), /Mentoria A Última Cartada/);
  assert.match(game.searchParams.get('text'), /Game Cartada Viva/);
});
test('Herbalife não herda o contato da mentoria', () => {
  assert.equal(content({ CONSULTORIA_WHATSAPP_NUMBER: '5511999999999' }).getHerbalifeContact(), null);
  const c = content({ CONSULTORIA_HERBALIFE_WHATSAPP_NUMBER: '5511888888888' });
  assert.equal(c.getConsultoriaContact(), null);
  assert.equal(new URL(c.getHerbalifeContact()).pathname, '/5511888888888');
});
test('Instagram aceita usuário e constrói domínio fixo', () => {
  const c = content({ CONSULTORIA_INSTAGRAM_USERNAME: ' @perfil_de_teste ' });
  assert.equal(c.getConsultoriaInstagram().username, '@perfil_de_teste');
  assert.equal(c.getConsultoriaInstagram().url, 'https://www.instagram.com/perfil_de_teste/');
});
test('Instagram rejeita URL, caminhos e entrada malformada', () => {
  for (const value of ['https://example.com', 'nome/path', 'nome?x=1', 'a..b', '.', 'a'.repeat(31)]) {
    assert.equal(content({ CONSULTORIA_INSTAGRAM_USERNAME: value }).getConsultoriaInstagram(), null);
  }
});
test('cadastro comercial aceita somente HTTPS sem credenciais', () => {
  for (const value of ['http://example.com', 'javascript:alert(1)', 'https://user:secret@example.com']) {
    assert.equal(content({ NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL: value }).getHerbalifeRegistrationUrl(), null);
  }
  assert.equal(content({ NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL: 'https://example.com/cadastro' }).getHerbalifeRegistrationUrl(), 'https://example.com/cadastro');
});
