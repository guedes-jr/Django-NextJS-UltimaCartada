from rest_framework import serializers


class PlayerRankingSerializer(serializers.Serializer):
    player_id = serializers.IntegerField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    total_points = serializers.IntegerField()
    total_plays = serializers.IntegerField()
    approved_evidences = serializers.IntegerField()


class GameSummarySerializer(serializers.Serializer):
    game_id = serializers.IntegerField()
    game_name = serializers.CharField()
    group_name = serializers.CharField()
    total_players = serializers.IntegerField()
    total_rounds = serializers.IntegerField()
    total_plays = serializers.IntegerField()
    total_evidences = serializers.IntegerField()
    approved_evidences = serializers.IntegerField()
    pending_evidences = serializers.IntegerField()


class PlayerPerformanceSerializer(serializers.Serializer):
    player_id = serializers.IntegerField()
    username = serializers.CharField()
    full_name = serializers.CharField()
    game_id = serializers.IntegerField()
    game_name = serializers.CharField()
    total_points = serializers.IntegerField()
    total_plays = serializers.IntegerField()
    rounds_played = serializers.IntegerField()
    evidences_sent = serializers.IntegerField()
    approved_evidences = serializers.IntegerField()
    rejected_evidences = serializers.IntegerField()
