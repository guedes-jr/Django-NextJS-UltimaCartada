from datetime import date

from rest_framework import serializers


class ReportFilterSerializer(serializers.Serializer):
    period = serializers.ChoiceField(choices=("quarter", "year"), default="quarter")
    year = serializers.IntegerField(min_value=2000, max_value=2100, default=date.today().year)
    quarter = serializers.IntegerField(min_value=1, max_value=4, required=False)
    group = serializers.IntegerField(min_value=1, required=False)
    journey = serializers.IntegerField(min_value=1, required=False)
    game = serializers.IntegerField(min_value=1, required=False)

    def validate(self, attrs):
        if attrs["period"] == "quarter" and not attrs.get("quarter"):
            raise serializers.ValidationError(
                {"quarter": "Selecione o trimestre do relatório."}
            )
        if attrs["period"] == "year":
            attrs.pop("quarter", None)
        return attrs
