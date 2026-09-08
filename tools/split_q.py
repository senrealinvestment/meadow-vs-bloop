#!/usr/bin/env python3
"""Split app.readable.js into CDN-sized window.__MVBQn chunks."""
from pathlib import Path

ROOT = Path("/workspace/repos/meadow-vs-bloop")
src = (ROOT / "app.readable.js").read_text()

def js_escape(s):
    out = []
    for ch in s:
        o = ord(ch)
        if ch == "\\":
            out.append("\\\\")
        elif ch == '"':
            out.append('\\"')
        elif ch == "\n":
            out.append("\\n")
        elif ch == "\r":
            out.append("\\r")
        elif ch == "\t":
            out.append("\\t")
        elif o < 32 or o > 126:
            out.append("\\u%04x" % o)
        else:
            out.append(ch)
    return "".join(out)

escaped = js_escape(src)
# Each file: window.__MVBQn="...";  plus newline. Budget 5000 bytes like existing.
MAX = 5000
files = []
i = 0
n = 0
while i < len(escaped):
    prefix = 'window.__MVBQ%d="' % n
    suffix = '";\n'
    room = MAX - len(prefix) - len(suffix)
    if room < 200:
        raise SystemExit("budget too small")
    chunk = escaped[i:i + room]
    # don't split in the middle of a \uXXXX or trailing backslash
    if i + room < len(escaped):
        # walk back if we ended on a partial escape
        while chunk.endswith("\\") or chunk[-1] in "uU":
            # crude: if ends with odd backslashes or incomplete \u
            if chunk.endswith("\\"):
                # if odd number of trailing backslashes, pull one back
                bs = 0
                k = len(chunk) - 1
                while k >= 0 and chunk[k] == "\\":
                    bs += 1
                    k -= 1
                if bs % 2 == 1:
                    chunk = chunk[:-1]
                    continue
            break
        # don't end mid \uXXXX
        uidx = chunk.rfind("\\u")
        if uidx >= 0 and len(chunk) - uidx < 6 and chunk[uidx:uidx+2] == "\\u":
            chunk = chunk[:uidx]
    files.append(prefix + chunk + suffix)
    i += len(chunk)
    n += 1

# Remove old q files
for p in ROOT.glob("app.q*.js"):
    p.unlink()

for i, body in enumerate(files):
    path = ROOT / ("app.q%d.js" % i)
    path.write_text(body)
    print(path.name, len(body))
print("COUNT", len(files), "SRC", len(src))
