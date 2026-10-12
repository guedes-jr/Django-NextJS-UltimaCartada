<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Frontend — instruções locais

Aplicam-se também `../AGENTS.md` e `../ia/frontend-guidelines.md`.

- Versões: confira `package.json` e lockfile. O projeto usa Next.js 16, React 19, TypeScript e CSS Modules; não adapte exemplos antigos sem verificar as APIs locais.
- Reutilize `AdminLayout`, `PlayerLayout`, `ProtectedRoute`, `Modal`, `PublicNavigation` e os componentes do domínio quando couber.
- Papéis e produtos: consulte `src/lib/auth.ts` e usos atuais de `ProtectedRoute`; não restrinja todo admin ao literal `ADMIN` nem libere mediador globalmente.
- Reutilize services e types existentes; HTTP via Axios de `src/lib/api.ts`. Sessão atual usa localStorage: acesse somente no cliente e não duplique o refresh.
- Use `"use client"` quando houver hooks, sessão ou APIs do navegador; não converta páginas autenticadas em Server Components sem desenhar o acesso à sessão.
- Identidade: preto, dourado e branco; reutilize tokens `--brand-*` de `src/app/globals.css`. Estilos de tela pertencem ao CSS Module.
- Preserve loading, erro, vazio, confirmação e bloqueio de envio repetido. Modais precisam de teclado, foco e rolagem adequados; valide mobile quando a interface mudar.
- Preserve a rota pública existente `/public/herbilife`, inclusive a grafia, até uma migração de URL explicitamente definida.
- PWA: não colocar API, páginas autenticadas ou mídias privadas no cache do service worker.

Validação em `frontend/`: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Não existe script de testes de interface em `package.json`; descreva a verificação manual quando necessária. Se `node_modules/next/dist/docs/` não estiver disponível, informe a ausência e consulte documentação oficial compatível antes de modificar APIs Next.js.
