import json

from apps.audit.models import AuditEvent


SENSITIVE_FIELDS = {
    "access",
    "authorization",
    "client_secret",
    "new_password",
    "password",
    "password_confirm",
    "refresh",
    "secret",
    "token",
}
MAX_CHANGES_SIZE = 12000


def sanitize_value(value):
    if isinstance(value, dict):
        return {
            key: "***" if key.lower() in SENSITIVE_FIELDS else sanitize_value(item)
            for key, item in value.items()
        }
    if isinstance(value, list):
        return [sanitize_value(item) for item in value[:50]]
    if isinstance(value, str) and len(value) > 1000:
        return f"{value[:1000]}…"
    return value


class AuditService:
    @staticmethod
    def record(**data):
        changes = sanitize_value(data.pop("changes", {}))
        encoded = json.dumps(changes, ensure_ascii=False, default=str)
        if len(encoded) > MAX_CHANGES_SIZE:
            changes = {
                "summary": encoded[:MAX_CHANGES_SIZE],
                "truncated": True,
            }
        return AuditEvent.objects.create(changes=changes, **data)

