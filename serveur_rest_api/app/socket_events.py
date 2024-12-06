from flask_socketio import SocketIO
from app import socketio

@socketio.on('nouvelle_publication')
def handle_new_publication(data):
    """Handle a new publication event and broadcast to all clients"""
    print(f"New publication received: {data}")
    socketio.send('Reply from server')
    socketio.emit('nouvelle_publication', {'message': 'New publication available!'})
