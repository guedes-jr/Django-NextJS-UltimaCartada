# Modelo de dados

Consulte [domain-map.md](../domain-map.md) e os modelos reais em `../../backend/apps/<dominio>/models.py`. Não usar esta referência como schema nem copiar campos esperados para migrations.

PlayerGroup.players usa PlayerProfile; Play.player usa User. Journey/etapas/matrículas associam jogos existentes. Prazos, produtos, documentos legais e desafios têm modelos e migrations próprios; confira constraints e relações antes de editar.
