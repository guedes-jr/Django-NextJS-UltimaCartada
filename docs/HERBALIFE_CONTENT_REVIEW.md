# Revisão da página de cadastro Herbalife

A página `/public/herbilife` agora é um tutorial público. Ela não promete percentual fixo de desconto, resultado de saúde nem aprovação de cadastro. Por padrão, a pessoa solicita à consultora o endereço correto de inscrição; o site oficial geral é oferecido como referência.

Antes de divulgar como guia definitivo, a responsável deve confirmar:

- modalidade de cadastro indicada para clientes e eventuais custos/condições;
- URL HTTPS de inscrição vinculada à consultora e sua autorização de uso público;
- sequência real das telas, dados solicitados e forma de ativação da conta;
- regras atuais de desconto, entrega, troca e cancelamento, sem publicar percentuais não confirmados;
- número de WhatsApp e identificação da consultora;
- uso da marca e texto final conforme as regras comerciais aplicáveis.

Depois da validação, configure `NEXT_PUBLIC_HERBALIFE_REGISTRATION_URL` no frontend e refaça o build/deploy. Não use link não oficial ou encurtador sem verificar o destino. A página não implementa analytics; eventos dependem de ferramenta e consentimento definidos em etapa própria.

Referência oficial consultada: https://www.herbalife.com/pt-br/perguntas-frequentes/o-que-e-a-herbalife e https://www.herbalife.com/pt-br/footer/entre-em-contato-conosco.
