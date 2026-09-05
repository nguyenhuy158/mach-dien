#!/usr/bin/env python3
"""Dev server cho trang mach-dien: tu reload trinh duyet khi file thay doi.
Chay: python3 dev.py [port]   (mac dinh 8765)"""
import http.server, socketserver, os, sys, time, glob

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
ROOT = os.path.dirname(os.path.abspath(__file__))
SNIPPET = b"""<script>
(()=>{let t=0;const es=new EventSource('/__reload');
 es.onmessage=e=>{if(!t){t=e.data;return}if(e.data!==t)location.reload()};
 es.onerror=()=>{};})();
</script>
"""

def stamp():
    return str(max((os.path.getmtime(f) for f in glob.glob(os.path.join(ROOT, '*'))
                    if os.path.isfile(f)), default=0))

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, *a):
        pass

    def do_GET(self):
        if self.path.split('?')[0] == '/__reload':
            return self.sse()
        p = self.path.split('?')[0]
        if p in ('/', '/index.html'):
            return self.page()
        return super().do_GET()

    def page(self):
        try:
            body = open(os.path.join(ROOT, 'index.html'), 'rb').read()
        except OSError:
            return self.send_error(404)
        body = body.replace(b'</body>', SNIPPET + b'</body>', 1)
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def sse(self):
        self.send_response(200)
        self.send_header('Content-Type', 'text/event-stream')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        last = None
        try:
            while True:
                s = stamp()
                if s != last:
                    last = s
                    self.wfile.write(b'data: %s\n\n' % s.encode())
                    self.wfile.flush()
                time.sleep(0.4)
        except (BrokenPipeError, ConnectionResetError):
            pass


class S(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == '__main__':
    print(f'http://localhost:{PORT}  (hot reload bat, Ctrl+C de dung)')
    S(('', PORT), H).serve_forever()
