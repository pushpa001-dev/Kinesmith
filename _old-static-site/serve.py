"""Local preview server for the Kinesmith site.

Python's stdlib http.server answers Range requests with 200 + the whole file.
Chrome's media element needs 206 Partial Content, so large videos stall on it.
This adds range support. Only needed locally — every real host does this already.

    python serve.py [port]
"""
import functools
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")
ROOT = os.path.dirname(os.path.abspath(__file__))


class RangeHandler(SimpleHTTPRequestHandler):
    # HTTP/1.0 deliberately: browsers abort range reads constantly while
    # scrubbing, and a half-written body on a kept-alive socket desyncs
    # every request that follows it on the same connection.
    protocol_version = "HTTP/1.0"

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        SimpleHTTPRequestHandler.end_headers(self)

    def send_head(self):
        rng = self.headers.get("Range")
        if not rng:
            return SimpleHTTPRequestHandler.send_head(self)

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return SimpleHTTPRequestHandler.send_head(self)
        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404)
            return None

        size = os.fstat(f.fileno()).st_size
        m = RANGE_RE.match(rng.strip())
        if not m:
            f.close()
            self.send_error(400)
            return None

        start_s, end_s = m.group(1), m.group(2)
        if start_s == "":                     # suffix form: bytes=-500
            start = max(0, size - int(end_s or 0))
            end = size - 1
        else:
            start = int(start_s)
            end = int(end_s) if end_s else size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", "bytes */%d" % size)
            self.end_headers()
            return None

        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()

        f.seek(start)
        remaining = end - start + 1
        while remaining > 0:
            chunk = f.read(min(64 * 1024, remaining))
            if not chunk:
                break
            try:
                self.wfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                self.close_connection = True
                break
            remaining -= len(chunk)
        f.close()
        return None

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    handler = functools.partial(RangeHandler, directory=ROOT)
    print("Kinesmith -> http://127.0.0.1:%d   (ctrl-c to stop)" % port, flush=True)
    try:
        ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")
