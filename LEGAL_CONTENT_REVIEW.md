# Revisão jurídica pendente — Termos e Privacidade

As páginas `/terms` e `/privacy` e o fluxo de aceite já estão implementados. A migração `legal.0002_standard_drafts` cria **minutas editáveis, não publicadas** para Termos de Uso e Política de Privacidade. Elas não são parecer jurídico nem descrevem necessariamente a operação real. O administrador deve substituir todos os campos `[PREENCHER:]`, retirar a indicação de minuta e obter revisão jurídica antes de publicar. A aplicação exibe aviso de preparação enquanto isso não ocorrer.

## Conteúdo a validar antes da primeira publicação

- Identificação do responsável pela plataforma, contato e canais para exercício de direitos.
- Finalidades e fundamentos aplicáveis a cada categoria de dados tratada.
- Categorias de dados: conta, jogo, evidências, arquivos, comunidade, mentoria, suporte e dados de auditoria.
- Prazos de retenção e critérios de eliminação para cada categoria, inclusive backups e chamados.
- Compartilhamento com infraestrutura, hospedagem, armazenamento, vídeo, mensagens, análise e outros fornecedores efetivamente utilizados.
- Cookies, armazenamento local, autenticação, analytics e preferências, conforme o funcionamento real do site.
- Regras de participação, conteúdo enviado pelo usuário, moderação da comunidade e tratamento de mídias.
- Segurança, incidentes, solicitações do titular e procedimentos operacionais correspondentes.
- Condições de contratação, cancelamento, suspensão de acesso e limites de uso de jogo/mentoria.
- Tratamento de informações potencialmente sensíveis e adequação do público participante.
- Política para mudança de versão material e necessidade de novo aceite.

## Publicação

1. Revisar e aprovar o texto fora do sistema.
2. Editar as minutas em `/admin/legal`; para documentos já publicados, usar “Criar nova versão”.
3. Conferir o conteúdo e publicar a versão.
4. Verificar `/terms` e `/privacy` publicamente e testar o aceite com uma conta de participante.

Versões publicadas são imutáveis. Alterações exigem uma nova versão. O aceite anterior permanece registrado, e o usuário deve aceitar a nova versão quando a opção correspondente estiver ativa.
