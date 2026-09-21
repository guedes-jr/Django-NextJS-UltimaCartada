import json
import uuid

from apps.audit.services import AuditService


AUDITED_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
IGNORED_PATH_PARTS = ("/token/", "/auth/login", "/django-admin/")
ACTION_BY_METHOD = {
    "POST": "CREATE_OR_ACTION",
    "PUT": "UPDATE",
    "PATCH": "UPDATE",
    "DELETE": "DELETE",
}


class AuditMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.audit_request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.audit_body = request.body if request.method in AUDITED_METHODS else b""
        response = self.get_response(request)
        if self._should_record(request, response):
            self._record(request, response)
        response["X-Request-ID"] = request.audit_request_id
        return response

    def _should_record(self, request, response):
        return (
            request.method in AUDITED_METHODS
            and request.path.startswith("/api/")
            and response.status_code < 400
            and not any(part in request.path for part in IGNORED_PATH_PARTS)
            and getattr(request, "user", None)
            and request.user.is_authenticated
        )

    def _record(self, request, response):
        try:
            body = json.loads(request.audit_body.decode("utf-8")) if request.audit_body else {}
        except (UnicodeDecodeError, json.JSONDecodeError):
            body = {"content_type": request.content_type or "unknown"}

        response_data = getattr(response, "data", {})
        object_id = ""
        if isinstance(response_data, dict):
            object_id = str(response_data.get("id", ""))

        parts = [part for part in request.path.split("/") if part]
        resource = parts[2] if len(parts) > 2 else "api"
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
        AuditService.record(
            actor=request.user,
            action=ACTION_BY_METHOD[request.method],
            resource=resource,
            object_id=object_id,
            path=request.path[:500],
            method=request.method,
            status_code=response.status_code,
            changes={"request": body},
            ip_address=forwarded or request.META.get("REMOTE_ADDR") or None,
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:500],
            request_id=request.audit_request_id,
        )
