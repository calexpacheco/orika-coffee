#!/bin/bash
# Double-click this file (or run it) to launch the ORIKA COFFEE scroll-world locally.
# It serves the folder on http://localhost:8777 and opens your browser.
cd "$(dirname "$0")" || exit 1
PORT=8777
echo "Serving ORIKA COFFEE on http://localhost:$PORT  (Ctrl+C to stop)"
( sleep 1; open "http://localhost:$PORT/index.html" ) &
python3 -m http.server "$PORT" --bind 127.0.0.1
