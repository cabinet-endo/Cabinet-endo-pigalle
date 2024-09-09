const notifications = document.getElementById('notifications');
const todoList = document.getElementById('todo-list');
const taskHeading = document.getElementById('task-heading');

// WebSocket connection
let ws = new WebSocket('ws://localhost:3000');

// Jouer le son d'alerte
function playAlertSound() {
    const audio = document.getElementById('alert-sound');
    audio.play();
}

ws.onmessage = function(event) {
    const tasks = JSON.parse(event.data);
    updateTaskList(tasks);
    playAlertSound();  // Jouer le son à chaque nouvelle tâche
};

function markAsDone(checkbox, taskId) {
    const task = checkbox.parentElement;
    task.classList.toggle('completed');
    if (checkbox.checked) {
        archiveTask(taskId); // Archive task when marked as done
    }
}

function archiveTask(taskId) {
    fetch('/archive-task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
    }).then(response => {
        if (response.ok) {
            console.log('Tâche archivée : ' + taskId);
        }
    });
}

function updateTaskList(tasks) {
    todoList.innerHTML = ''; // Clear the list before adding new tasks
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="markAsDone(this, '${task.id}')">
            ${task.command} (Provenance : ${task.origin}) - Reçu à ${task.timestamp}
        `;
        todoList.appendChild(li);
    });
}

function showTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskHeading.textContent = 'Liste des tâches en cours';
            updateTaskList(tasks);
        });
}

function showArchivedTasks() {
    fetch('/archived-tasks')
        .then(response => response.json())
        .then(tasks => {
            taskHeading.textContent = 'Liste des tâches archivées';
            updateTaskList(tasks);
        });
}
