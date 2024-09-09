const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Créer une application Express
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let tasks = [];
let archivedTasks = [];

// Servir les fichiers statiques (comme index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// WebSocket pour gérer les messages
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const task = JSON.parse(message);
        tasks.push(task);
        broadcastTasks();
    });
});

// Envoyer les tâches actuelles à chaque connexion
function broadcastTasks() {
    const taskData = JSON.stringify(tasks);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(taskData);
        }
    });
}

// Route pour obtenir les tâches actuelles
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Route pour obtenir les tâches archivées
app.get('/archived-tasks', (req, res) => {
    res.json(archivedTasks);
});

// Route pour archiver une tâche
app.post('/archive-task', (req, res) => {
    const taskId = req.body.taskId;
    const taskToArchive = tasks.find(task => task.id === taskId);
    if (taskToArchive) {
        archivedTasks.push(taskToArchive);
        tasks = tasks.filter(task => task.id !== taskId);
    }
    broadcastTasks(); // Mettre à jour les clients
    res.sendStatus(200);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
