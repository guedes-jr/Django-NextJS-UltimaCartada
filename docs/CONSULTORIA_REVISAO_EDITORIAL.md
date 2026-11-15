# Revisão editorial da proposta — 14/11/2026

Conferência dos textos em código contra [CONSULTORIA.md](../CONSULTORIA.md). Evidências de execução em [PROJECT_AUDIT.md](PROJECT_AUDIT.md); decisões e trabalho pendente permanecem somente no [plano ativo](../IMPLEMENTATION_PLAN.md). Esta revisão técnica não aprova dados profissionais, condições comerciais, direitos de imagem ou publicação.

## Escopo e resultado

Lidos integralmente: `ConsultoriaPages.tsx` (home, mentoria e game), `ConsultoriaSections.tsx` (hero, inclusão, condições, FAQ e contato), `ConsultoriaShell.tsx` (navegação/rodapé), `content.ts`, `HerbalifeInformation.tsx` e `metadata.ts`, em `frontend/src/components/consultoria/`. Conferidos também login, dashboard, navegação da participante, proteção de rotas, manifesto e metadados globais. Telas antigas sob chave desligada e conteúdo editorial administrável não receberam aprovação por esta revisão.

| Trecho conferido | Resultado na proposta atual | Limite para aceite |
| --- | --- | --- |
| Home: hero e chamadas | Magaly é a marca principal; frase central preservada; mentoria é o CTA principal e game é secundário. | Assinatura e monograma originais ainda ausentes. |
| Home: editorial e frase simbólica | Texto acolhe interrupções e retomadas; “Foi uma carta, não foi o jogo.” preservada. | Revisão de tom pela titular. |
| Home: duas experiências | Mentoria principal, game incluído; metodologia não aparece como terceira compra. | Conferir composição visual e condições finais. |
| Home: apresentação profissional | Nome público e função do briefing; sem registro, especialidade ou credencial inventados. | Titular precisa confirmar identificação e uso das fotografias. |
| Mentoria: público, benefícios e processo | Ações possíveis, consciência e autonomia; sem resultado garantido ou prazo presumido. | Estrutura real de encontros, materiais e suporte ainda “A confirmar”. |
| Mentoria: inclusão e FAQ | Direito ao game sem nova aquisição explícito; FAQ distingue atividade educativa de atendimento clínico. | Duração, validade e jornadas incluídas precisam de confirmação. |
| Game: hero, funcionamento e ilustração | Game educativo; texto distingue jornada diária de rodadas e depende do vínculo do grupo. Ilustração identificada, sem dados de participantes. | Homologação da experiência autenticada e do percurso efetivamente oferecido. |
| Game: participação independente | FAQ informa que não há inscrição independente disponível nessa página; sem preço, checkout ou acesso irrestrito. | Modalidade futura depende de decisão estratégica. |
| Contato e rodapé | WhatsApp separado por assunto e Herbalife; Instagram só com usuário configurado; identificação profissional é texto escapado. Nenhum formulário público ou disparo automático criado. | Configuração não comprova titularidade ou aprovação; validar destinos reais. |
| Herbalife | Atividade comercial separada; sem desconto ou resultado de saúde garantidos; cadastro/pagamento não são feitos nesta página. | Validar condição comercial, vínculo e destino de cadastro com a responsável. |
| Login e áreas internas | Nomes das duas experiências identificados; menu depende dos produtos e mantém autorização existente. Ajuda do login corrigida para contato público. | Teste autenticado completo e dados da conta ainda necessários. |
| Metadados/PWA | Marca e descrições acompanham a chave; descrição social do game corrigida para explicitar dependência da jornada do grupo. | Ícones e imagens sociais definitivos aguardam originais e aceite. |

## Correções aplicadas neste recorte

1. Ajuda do login: `/player/support` exige sessão e devolvia visitantes ao login. O link agora usa `/#contato`, cuja seção existe nas duas apresentações. O texto informa “Veja os canais de contato”, sem prometer suporte aberto a visitantes. Contato ainda não confirmado permanece provisório.
2. Descrição do game: substituída a enumeração incondicional de cartada diária/intenção/evidência por texto que informa que o percurso depende da jornada vinculada ao grupo. Description, Open Graph e Twitter compartilham essa descrição.
3. Smoke HTTP passou a verificar o destino público da ajuda e a presença da ressalva nos três metadados do game atualizado. Trata-se de contrato do HTML servido, sem executar login, contato externo ou encaminhamento autenticado no navegador.

## Limites da revisão

Não foram inferidos prazos a partir das três etapas técnicas. Não foram alterados textos jurídicos, fotografias, depoimentos, logos ou dados reais. Ausência de alegações indevidas nos trechos revisados não substitui revisão profissional externa. CONS-12.6 permanece aberto até conferência dos ativos originais, preenchimento dos fatos e revisão final da titular. O conjunto integral das telas autenticadas e do conteúdo carregado por API não está abrangido por esta leitura editorial.
