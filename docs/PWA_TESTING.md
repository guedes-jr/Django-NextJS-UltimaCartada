# PWA — verificação manual

O manifesto, os ícones e o service worker permitem instalação em navegadores compatíveis sob HTTPS (ou `localhost`). O cache contém somente uma página genérica: `/offline.html` na apresentação legada ou `/offline-consultoria.html` com `ENABLE_CONSULTORIA_SITE=true`; respostas da API, páginas autenticadas e mídias dos participantes **não** são armazenadas pelo service worker.

1. Execute `cd frontend && npm run build && npm run start` em `localhost`, ou use HTTPS em homologação.
2. No Chrome/Edge desktop e Android, abra DevTools → Application → Manifest. Confira nome, escopo, ícones 192/512 e máscara. Verifique o botão “Instalar aplicativo” quando o navegador oferecer o evento de instalação.
3. Instale, abra em janela independente e confirme que `/dashboard` encaminha corretamente para login ou área contratada.
4. Em Application → Service Workers, confirme `/sw.js` no legado ou `/sw.js?presentation=consultoria` na apresentação atualizada. Desligue a rede e navegue: aparece somente a página offline, sem dados de jogador. Ligue a rede e recarregue.
5. Faça logout e repita o teste offline. Nenhuma resposta privada deve aparecer. Em Application → Cache Storage, o cache `ultima-cartada-offline-v2-legacy` ou `ultima-cartada-offline-v2-consultoria` deve conter somente o HTML correspondente.
6. No Safari/iOS, a instalação é pelo menu Compartilhar → Adicionar à Tela de Início; `beforeinstallprompt` não é oferecido nessa plataforma. Verifique o ícone e a inicialização em modo independente.
7. Após publicar uma atualização, recarregue e verifique que o novo service worker assumiu o controle. Ao mudar arquivos do cache offline, aumente a versão `CACHE_NAME` em `public/sw.js`. Teste também a troca de apresentação e o rollback: o cache offline anterior deve ser removido, preservando caches de outros recursos.

O teste em aparelhos físicos e no domínio de produção ainda precisa ser executado no ambiente de deploy.

## Verificações automatizadas

`cd frontend && npm run test:pwa` executa nove testes do código real do worker em Node/VM, com rede e Cache Storage substituídos por objetos de teste. Cobre instalação, falha de instalação, fallback, ausência de cache de respostas privadas, erros HTTP e limpeza restrita ao namespace offline. Não comprova instalação ou funcionamento em navegador.

O worker recebe cabeçalhos de revalidação e usa updateViaCache=none. A tela nova é autossuficiente, sem fontes externas, API ou formulários; usa Georgia/Arial quando as fontes da marca não estão disponíveis. A prova estática está em `/offline-consultoria.html` e no guia visual, mas abri-la não simula falta de rede.

Inspeção visual da prova estática em 14/11/2026: Chrome nativo em 320/768 px, título/ações/aviso/rodapé conferidos. Recarregar o HTML pela ação “Tentar novamente” foi exercitado; não é evidência de instalação, fallback sob perda de rede ou cache real no navegador.
