# PWA — verificação manual

O manifesto, os ícones e o service worker permitem instalação em navegadores compatíveis sob HTTPS (ou `localhost`). O cache contém somente `/offline.html`; respostas da API, páginas autenticadas e mídias dos participantes **não** são armazenadas pelo service worker.

1. Execute `cd frontend && npm run build && npm run start` em `localhost`, ou use HTTPS em homologação.
2. No Chrome/Edge desktop e Android, abra DevTools → Application → Manifest. Confira nome, escopo, ícones 192/512 e máscara. Verifique o botão “Instalar aplicativo” quando o navegador oferecer o evento de instalação.
3. Instale, abra em janela independente e confirme que `/dashboard` encaminha corretamente para login ou área contratada.
4. Em Application → Service Workers, confirme `/sw.js`. Desligue a rede e navegue: aparece somente a página offline, sem dados de jogador. Ligue a rede e recarregue.
5. Faça logout e repita o teste offline. Nenhuma resposta privada deve aparecer. Em Application → Cache Storage, deve existir apenas `offline.html`.
6. No Safari/iOS, a instalação é pelo menu Compartilhar → Adicionar à Tela de Início; `beforeinstallprompt` não é oferecido nessa plataforma. Verifique o ícone e a inicialização em modo independente.
7. Após publicar uma atualização, recarregue e verifique que o novo service worker assumiu o controle. Ao mudar arquivos do cache offline, aumente a versão `CACHE_NAME` em `public/sw.js`.

O teste em aparelhos físicos e no domínio de produção ainda precisa ser executado no ambiente de deploy.
