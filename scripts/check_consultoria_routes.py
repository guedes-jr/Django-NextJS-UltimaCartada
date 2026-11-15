#!/usr/bin/env python3
"""Verificação HTTP de um servidor local de produção, sem banco ou browser.

Uso: python3 scripts/check_consultoria_routes.py --mode legacy --base-url http://127.0.0.1:3002
Executar novamente com --mode updated após um build com ENABLE_CONSULTORIA_SITE=true.
legacy e updated pressupõem ENABLE_CONSULTORIA_PREVIEW=false.
O modo preview verifica propostas habilitadas em desenvolvimento/homologação.
"""
import argparse
import json
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.error import HTTPError
from urllib.parse import unquote, urljoin, urlsplit
from urllib.request import HTTPRedirectHandler, build_opener


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        return None


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.h1_count = 0
        self.title = ""
        self.in_title = False
        self.access_theme = False
        self.form_count = 0
        self.links = []
        self.ids = set()
        self.canonical = None
        self.meta = {}
        self.text = []
        self.hidden_depth = 0
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("data-consultoria-access-theme") == "true":
            self.access_theme = True
        if tag in ("script", "style"):
            self.hidden_depth += 1
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.h1_count += 1
        if tag == "form":
            self.form_count += 1
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a":
            self.links.append(attrs.get("href", ""))
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "meta":
            self.meta[attrs.get("name") or attrs.get("property")] = attrs.get("content", "")

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag in ("script", "style"):
            self.hidden_depth -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if not self.hidden_depth:
            self.text.append(data)


def verify(base_url, mode):
    opener = build_opener(NoRedirect)
    checked = []
    documents = {}

    def verify_login_contact(document):
        if "/#contato" not in document.links or "/player/support" in document.links:
            raise AssertionError("Ajuda do login deve levar ao contato público, sem exigir sessão")
        if "contato" not in documents["/"].ids:
            raise AssertionError("Ajuda do login aponta para seção pública inexistente")

    def verify_links():
        # Somente páginas já consultadas; nenhum destino externo/API é requisitado.
        count = 0
        public_host = "magalyabreu.com.br"
        local_host = urlsplit(base_url).netloc
        for source, document in documents.items():
            if mode == "preview" and not source.startswith("/preview/"):
                continue
            for href in document.links:
                target = urlsplit(urljoin(base_url + source, href))
                if target.scheme not in ("http", "https") or target.netloc not in (local_host, public_host):
                    continue
                path = target.path or "/"
                if path not in documents:
                    raise AssertionError(f"{source}: destino local não verificado: {href}")
                if target.fragment and unquote(target.fragment) not in documents[path].ids:
                    raise AssertionError(f"{source}: âncora sem destino em {href}")
                count += 1
        print(f"{count} links internos e fragmentos conferidos entre páginas.")

    def request(path, expected_status):
        try:
            response = opener.open(base_url + path, timeout=30)
        except HTTPError as error:
            response = error
        with response:
            status = response.code
            headers = response.headers
            body = response.read().decode("utf-8")
        if status != expected_status:
            raise AssertionError(f"{path}: HTTP {status}, esperado {expected_status}")
        checked.append((path, status))
        return headers, body

    def verify_illustration():
        _, svg = request("/consultoria/player-journey.svg", 200)
        documents["/consultoria/player-journey.svg"] = Document(svg)
        root = ET.fromstring(svg)
        text = " ".join(root.itertext())
        if "sem dados pessoais" not in text or "a confirmar" not in text:
            raise AssertionError("Ilustração sem identificação de proposta provisória")
        if any(value in text for value in ("21 dias", "Jogo 1", "Jogo 2", "Jogo 3")):
            raise AssertionError("Ilustração anuncia duração/quantidade não confirmada")
        if any(node.tag.rsplit("}", 1)[-1] in ("script", "image", "foreignObject") for node in root.iter()):
            raise AssertionError("Ilustração deve ser vetorial e autossuficiente")

    previews = (
        "/preview/consultoria", "/preview/consultoria/mentoria", "/preview/consultoria/game",
        "/preview/consultoria/herbalife", "/preview/consultoria/guia-visual", "/preview/consultoria/revisao",
    )
    if mode == "preview":
        verify_illustration()
        for path in previews:
            _, body = request(path, 200)
            document = Document(body)
            documents[path] = document
            if document.h1_count != 1 or "noindex" not in document.meta.get("robots", ""):
                raise AssertionError(f"{path}: H1 ou bloqueio de indexação inválido")
            for href in document.links:
                if href.startswith("#") and href[1:] not in document.ids:
                    raise AssertionError(f"{path}: âncora sem destino: {href}")
            text = " ".join(document.text)
            if "Prévia para aprovação" not in text:
                raise AssertionError(f"{path}: rascunho sem identificação")
        review = documents["/preview/consultoria/revisao"]
        if review.form_count or not {"paginas", "dados", "dispositivos", "contato"}.issubset(review.ids):
            raise AssertionError("Roteiro de revisão sem seções ou com coleta não prevista")
        if "A aprovação da proposta não publica o site." not in " ".join(review.text):
            raise AssertionError("Roteiro confunde aprovação com publicação")
        for asset in ("story-background.svg", "share-background.svg"):
            _, svg = request("/consultoria/templates/" + asset, 200)
            documents["/consultoria/templates/" + asset] = Document("")
            if "<svg" not in svg or "<text" in svg or "<script" in svg:
                raise AssertionError("Fundo SVG inválido ou com texto/script incorporado")
        for path in ("/", "/login", "/terms", "/privacy", "/offline-consultoria.html"):
            _, body = request(path, 200)
            documents[path] = Document(body)
        verify_login_contact(documents["/login"])
        verify_links()
        for path, status in checked:
            print(f"{status} {path}")
        print(f"Modo {mode}: {len(checked)} respostas e contratos conferidos.")
        return

    if mode == "legacy":
        _, home = request("/", 200)
        documents["/"] = Document(home)
        if "Consultoria" not in " ".join(Document(home).text):
            raise AssertionError("A home legada deixou de ser a apresentação padrão")
        request("/public/consultoria", 200)
        request("/public/ultima-cartada", 200)
        headers, _ = request("/public/cartada-viva", 308)
        if urlsplit(headers.get("Location", "")).path != "/public/ultima-cartada":
            raise AssertionError("O redirecionamento legado do game mudou")
    else:
        verify_illustration()
        paths = ("/", "/public/ultima-cartada", "/public/cartada-viva")
        for path in paths:
            _, body = request(path, 200)
            document = Document(body)
            documents[path] = document
            text = " ".join(document.text)
            if document.h1_count != 1:
                raise AssertionError(f"{path}: quantidade de H1 inválida")
            canonical = urlsplit(document.canonical or "")
            if (canonical.scheme, canonical.netloc, canonical.path or "/", canonical.query, canonical.fragment) != ("https", "magalyabreu.com.br", path, "", ""):
                raise AssertionError(f"{path}: canonical incorreto: {document.canonical}")
            if document.meta.get("og:site_name") != "Magaly Abreu":
                raise AssertionError(f"{path}: marca incorreta nos metadados")
            if path == "/public/cartada-viva":
                for key in ("description", "og:description", "twitter:description"):
                    if "O percurso depende da jornada vinculada ao seu grupo" not in document.meta.get(key, ""):
                        raise AssertionError(f"{path}: {key} presume percurso único para todos os grupos")
            if "sem precisar adquirir o game novamente" not in text:
                raise AssertionError(f"{path}: inclusão do game não está explícita")
            if path in ("/public/ultima-cartada", "/public/cartada-viva"):
                if "condicoes" not in document.ids or "A confirmar" not in text:
                    raise AssertionError(f"{path}: condições provisórias ausentes")
                if any(value in text for value in ("6 meses", "21 dias", "3 jogos")):
                    raise AssertionError(f"{path}: duração comercial não confirmada")
            if "Prévia para aprovação" in text:
                raise AssertionError(f"{path}: aviso interno de prévia exposto")
            if "Jogo terapêutico e mentoria em grupo" in text:
                raise AssertionError(f"{path}: subtítulo conjunto antigo exposto")
            for href in document.links:
                if "/preview/" in href:
                    raise AssertionError(f"{path}: link para prévia: {href}")
                if href.startswith("#") and href[1:] not in document.ids:
                    raise AssertionError(f"{path}: âncora sem destino: {href}")
            if not set(paths).issubset(document.links):
                raise AssertionError(f"{path}: falta navegação entre as três páginas")
        headers, _ = request("/public/consultoria", 308)
        if urlsplit(headers.get("Location", "")).path != "/public/ultima-cartada":
            raise AssertionError("Consultoria não redireciona à mentoria")

    for path in previews:
        request(path, 404)
    for path in ("/login", "/terms", "/privacy", "/public/herbilife"):
        _, body = request(path, 200)
        document = Document(body)
        if mode == "updated":
            documents[path] = document
        text = " ".join(document.text)
        if path in ("/terms", "/privacy"):
            if document.access_theme != (mode == "updated"):
                raise AssertionError(f"{path}: tema legal não acompanha a chave")
            if mode == "updated":
                expected_title = ("Termos de Uso" if path == "/terms" else "Política de Privacidade") + " | Magaly Abreu"
                if document.title != expected_title:
                    raise AssertionError(f"{path}: título legal incorreto: {document.title}")
            if mode == "updated" and "Magaly Abreu" not in text:
                raise AssertionError(f"{path}: marca principal ausente")
        if path == "/login":
            verify_login_contact(document)
            if document.access_theme != (mode == "updated"):
                raise AssertionError("Tema de acesso não acompanha a chave de apresentação")
            if "Magaly Abreu" not in text or "A Última Cartada — Mentoria" not in text or "Cartada Viva — Game" not in text:
                raise AssertionError("Login não identifica as experiências corretamente")
        if path == "/public/herbilife" and mode == "updated":
            if "Atividade comercial separada" not in text or "não é apresentada neste site como requisito" not in text:
                raise AssertionError("Separação comercial Herbalife não está explícita")
            if document.canonical != "https://magalyabreu.com.br/public/herbilife":
                raise AssertionError("Canonical da atividade Herbalife inválido")
            for href in document.links:
                if "/preview/" in href:
                    raise AssertionError("Página comercial aponta para prévia")
    for path in ("/dashboard", "/mentorship", "/player/home", "/player/performance", "/player/ranking", "/player/community", "/player/settings", "/player/support"):
        _, body = request(path, 200)
        documents[path] = Document(body)
        if documents[path].access_theme != (mode == "updated"):
            raise AssertionError(f"{path}: escopo de tema não acompanha a chave")
    _, body = request("/manifest.webmanifest", 200)
    manifest = json.loads(body)
    if manifest.get("start_url") != "/dashboard" or manifest.get("scope") != "/":
        raise AssertionError("Entrada ou escopo PWA alterados")
    if mode == "updated":
        if "Game de hábitos incluído" not in manifest.get("description", ""):
            raise AssertionError("Descrição PWA não acompanha o novo posicionamento")
        if manifest.get("theme_color") != "#702C40":
            raise AssertionError("Cor PWA não acompanha a nova identidade")
    headers, worker_source = request("/sw.js?presentation=consultoria" if mode == "updated" else "/sw.js", 200)
    if "no-store" not in headers.get("Cache-Control", "") or "javascript" not in headers.get("Content-Type", ""):
        raise AssertionError("Cabeçalhos de atualização do service worker inválidos")
    if "offline-consultoria.html" not in worker_source:
        raise AssertionError("Seleção de apresentação offline ausente")
    offline_path = "/offline-consultoria.html" if mode == "updated" else "/offline.html"
    _, offline_html = request(offline_path, 200)
    offline_document = Document(offline_html)
    if offline_document.h1_count != 1 or offline_document.form_count:
        raise AssertionError("Tela offline inválida ou com formulário")
    if mode == "updated" and "noindex" not in offline_document.meta.get("robots", ""):
        raise AssertionError("Prova offline sem bloqueio de indexação")
    if mode == "updated":
        verify_links()
    for path, status in checked:
        print(f"{status} {path}")
    print(f"Modo {mode}: {len(checked)} respostas e contratos conferidos.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("legacy", "updated", "preview"), required=True)
    parser.add_argument("--base-url", default="http://127.0.0.1:3002")
    args = parser.parse_args()
    url = urlsplit(args.base_url)
    if url.scheme != "http" or url.hostname not in ("127.0.0.1", "localhost", "::1") or url.path not in ("", "/") or url.query or url.fragment or url.username or url.password:
        parser.error("Use a origem HTTP de um servidor local, sem credenciais, caminho ou query")
    verify(args.base_url.rstrip("/"), args.mode)


if __name__ == "__main__":
    main()
