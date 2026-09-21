from django.db import migrations


TERMS = """TERMOS DE USO — MINUTA PARA REVISÃO

1. Identificação. A plataforma A Última Cartada é disponibilizada por [PREENCHER: nome ou razão social, CPF/CNPJ e endereço do responsável], contatável em [PREENCHER: e-mail de contato]. Estes Termos regulam o acesso ao jogo terapêutico, à mentoria e às áreas de comunidade e suporte.

2. Conta e acesso. O participante deve fornecer informações corretas, manter suas credenciais em sigilo e comunicar acessos indevidos. O acesso a cada produto depende da contratação e das permissões atribuídas à conta. Menores de idade somente poderão utilizar o serviço conforme [PREENCHER: política de idade e autorização].

3. Funcionamento do serviço. O jogo organiza jornadas, desafios, pontuação, evidências e ranking conforme as regras exibidas na plataforma. Prazos de envio, critérios de avaliação e condições de participação devem ser consultados em cada desafio. A mentoria oferece os conteúdos e encontros expressamente contratados. Materiais de bem-estar e hábitos não substituem avaliação, diagnóstico ou tratamento por profissionais de saúde.

4. Conteúdo do participante e comunidade. O participante responde pelos textos, imagens, vídeos e demais arquivos que publicar ou enviar. Não deve divulgar dados de terceiros sem autorização, conteúdos ilícitos, ofensivos ou que violem direitos alheios. Ao publicar na comunidade, autoriza a exibição do conteúdo aos integrantes do grupo para a operação do serviço, sem transferência de titularidade. A administração poderá moderar conteúdo contrário a estas regras, com registro da ação quando aplicável.

5. Contratação e pagamentos. Preços, prazo de acesso, cancelamento, reembolso e condições comerciais são os informados na oferta ou contrato específico aceito pelo participante, observada a legislação aplicável. [PREENCHER: canal e regras comerciais efetivamente praticadas].

6. Disponibilidade e responsabilidade. A plataforma busca manter o serviço disponível e seguro, mas poderá passar por manutenção ou indisponibilidade. O participante deve avaliar com profissional habilitado qualquer decisão relativa à sua saúde. Nenhuma disposição destes Termos afasta direitos garantidos por lei.

7. Suspensão e encerramento. Violações destes Termos poderão resultar em moderação, suspensão ou encerramento de acesso, respeitados o contrato e os direitos aplicáveis. Solicitações sobre a conta podem ser feitas por [PREENCHER: canal de atendimento].

8. Alterações e contato. Mudanças relevantes serão apresentadas em nova versão, com novo aceite quando exigido. Dúvidas e solicitações: [PREENCHER: e-mail e endereço de contato]. Data de vigência: [PREENCHER: data]."""


PRIVACY = """POLÍTICA DE PRIVACIDADE — MINUTA PARA REVISÃO

1. Controlador e contato. O responsável pelo tratamento de dados é [PREENCHER: nome ou razão social, CPF/CNPJ e endereço]. Contato para privacidade e exercício de direitos: [PREENCHER: e-mail e, se aplicável, encarregado].

2. Dados tratados. Conforme o uso da plataforma, podem ser tratados dados de cadastro e autenticação; participação em grupos, jogos, desafios, pontuação e ranking; evidências e mídias enviadas; publicações, comentários e reações da comunidade; acesso a conteúdos de mentoria; chamados de suporte; registros técnicos e de auditoria. [PREENCHER: confirmar categorias efetivamente coletadas, inclusive dados sensíveis].

3. Finalidades e bases legais. Os dados são utilizados para criar e proteger contas, entregar os serviços contratados, operar jogos e grupos, avaliar evidências, permitir interação na comunidade, prestar suporte e cumprir obrigações legais. [PREENCHER: mapear cada finalidade à base legal aplicável e justificar eventual tratamento de dados sensíveis]. Não se deve presumir consentimento para tratamentos que dependam de outra base ou de escolha específica.

4. Visibilidade e compartilhamento. Informações publicadas na comunidade e no ranking podem ser vistas pelos participantes do mesmo grupo, conforme as regras da plataforma. Dados poderão ser acessados por prestadores necessários à hospedagem, armazenamento, comunicação e operação, sob contratos adequados. [PREENCHER: fornecedores, locais de tratamento e hipóteses de transferência internacional]. Não há autorização geral para divulgar evidências privadas fora do contexto informado.

5. Retenção e eliminação. Os dados serão mantidos pelo período necessário às finalidades informadas e às obrigações legais, contratuais ou de defesa de direitos. [PREENCHER: prazos ou critérios concretos por categoria, inclusive backups, mídia, auditoria e suporte]. Ao término, serão eliminados ou anonimizados quando cabível.

6. Segurança. São adotadas medidas técnicas e administrativas proporcionais aos riscos, incluindo controles de acesso. Nenhum sistema é totalmente imune a incidentes. [PREENCHER: procedimento e canal para comunicação de incidentes].

7. Direitos do titular. O titular pode solicitar, nos termos da LGPD, confirmação e acesso, correção, anonimização, bloqueio ou eliminação quando cabíveis, portabilidade, informações sobre compartilhamento, revogação de consentimento e revisão de decisões automatizadas aplicáveis. Solicitações: [PREENCHER: canal e procedimento de verificação de identidade]. Também é possível peticionar à ANPD nas hipóteses legais.

8. Cookies e armazenamento local. Recursos estritamente necessários podem manter sessão e preferências. [PREENCHER: inventário real de cookies, armazenamento local, análise de uso, finalidade, duração e mecanismo de escolha quando necessário].

9. Crianças, alterações e vigência. [PREENCHER: público-alvo e política para crianças e adolescentes]. Alterações relevantes serão comunicadas pelos canais adequados. Versão vigente desde [PREENCHER: data]."""


def create_drafts(apps, schema_editor):
    LegalDocument = apps.get_model("legal", "LegalDocument")
    for kind, title, body in (
        ("TERMS", "Termos de Uso", TERMS),
        ("PRIVACY", "Política de Privacidade", PRIVACY),
    ):
        LegalDocument.objects.get_or_create(
            kind=kind,
            version="modelo-1.0",
            defaults={"title": title, "body": body, "requires_acceptance": True},
        )


class Migration(migrations.Migration):
    dependencies = [("legal", "0001_initial")]
    operations = [migrations.RunPython(create_drafts, migrations.RunPython.noop)]
