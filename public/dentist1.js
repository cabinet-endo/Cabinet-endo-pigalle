let ws = new WebSocket('ws://localhost:3000');

function sendCommand(command) {
    const task = {
        id: Date.now().toString(),
        command: command,
        origin: 'Dentiste 1',
        timestamp: new Date().toLocaleTimeString(),
        completed: false
    };
    ws.send(JSON.stringify(task));
}
