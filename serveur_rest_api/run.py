from app import create_app
from app.socket_events import *

app, socketio = create_app()

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
