// Sample initial todos
let todos = [
    { id: 1, text: "Learn about AWS Lambda", completed: false },
    { id: 2, text: "Create a serverless API", completed: true },
    { id: 3, text: "Build a frontend for the API", completed: false }
];

let currentFilter = 'all';

// DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const apiStatus = document.getElementById('api-status');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const syncBtn = document.getElementById('sync-btn');

// Initialize the app
function init() {
    renderTodos();
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
    
    // AWS API simulation
    saveBtn.addEventListener('click', simulateSaveToAWS);
    loadBtn.addEventListener('click', simulateLoadFromAWS);
    syncBtn.addEventListener('click', simulateSyncWithAWS);
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        todos.push(newTodo);
        renderTodos();
        todoInput.value = '';
        showStatus('Task added successfully!', 'success');
    }
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    
    renderTodos();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
    showStatus('Task deleted successfully!', 'success');
}

// Edit a todo
function editTodo(id, newText) {
    if (newText.trim()) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: newText.trim() };
            }
            return todo;
        });
        
        renderTodos();
        showStatus('Task updated successfully!', 'success');
    }
}

// Render todos based on current filter
function renderTodos() {
    // Clear the list
    todoList.innerHTML = '';
    
    // Get filtered todos
    let filteredTodos = [];
    if (currentFilter === 'all') {
        filteredTodos = todos;
    } else if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Add todos to the list or show empty state
    if (filteredTodos.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        if (currentFilter === 'all') {
            emptyState.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <h3>No tasks yet</h3>
                <p>Add a new task to get started!</p>
            `;
        } else if (currentFilter === 'active') {
            emptyState.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>No active tasks</h3>
                <p>All tasks are completed!</p>
            `;
        } else if (currentFilter === 'completed') {
            emptyState.innerHTML = `
                <i class="fas fa-tasks"></i>
                <h3>No completed tasks</h3>
                <p>Complete some tasks to see them here.</p>
            `;
        }
        
        todoList.appendChild(emptyState);
    } else {
        filteredTodos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
    }
    
    // Update counter
    updateItemsCounter();
}

// Create a todo element
function createTodoElement(todo) {
    const todoDiv = document.createElement('div');
    todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'complete-checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    
    const todoText = document.createElement('div');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;
    todoText.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = todo.text;
        input.className = 'edit-input';
        
        todoText.replaceWith(input);
        input.focus();
        
        const finishEdit = () => {
            editTodo(todo.id, input.value);
        };
        
        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') finishEdit();
        });
    });
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';
    
    const completeBtn = document.createElement('button');
    completeBtn.className = 'action-btn complete-btn';
    completeBtn.innerHTML = '<i class="fas fa-check"></i>';
    completeBtn.title = todo.completed ? 'Mark as active' : 'Mark as complete';
    completeBtn.addEventListener('click', () => toggleTodo(todo.id));
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);
    
    todoDiv.appendChild(checkbox);
    todoDiv.appendChild(todoText);
    todoDiv.appendChild(actionsDiv);
    
    return todoDiv;
}

// Update items counter
function updateItemsCounter() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    
    const counterText = `Total: ${total} | Active: ${active} | Completed: ${completed}`;
    document.querySelector('.subtitle').textContent = counterText;
}

// Show status message
function showStatus(message, type = '') {
    apiStatus.textContent = `Status: ${message}`;
    apiStatus.className = 'status';
    if (type) {
        apiStatus.classList.add(type);
    }
    
    // Clear status after 3 seconds
    setTimeout(() => {
        apiStatus.textContent = 'Status: Ready to connect to AWS API';
        apiStatus.className = 'status';
    }, 3000);
}

// Simulate saving to AWS
function simulateSaveToAWS() {
    showStatus('Saving to AWS API...');
    
    // Simulate API call delay
    setTimeout(() => {
        showStatus('Data successfully saved to AWS!', 'success');
    }, 1500);
}

// Simulate loading from AWS
function simulateLoadFromAWS() {
    showStatus('Loading from AWS API...');
    
    // Simulate API call delay
    setTimeout(() => {
        // Simulate loaded data
        todos = [
            { id: 1, text: "Completed task from cloud", completed: true },
            { id: 2, text: "New task from AWS", completed: false },
            { id: 3, text: "Another task loaded", completed: false }
        ];
        
        renderTodos();
        showStatus('Data successfully loaded from AWS!', 'success');
    }, 1500);
}

// Simulate syncing with AWS
function simulateSyncWithAWS() {
    showStatus('Syncing with AWS API...');
    
    // Simulate API call delay with loading animation
    apiStatus.innerHTML = 'Status: Syncing with AWS API <span class="loading"></span>';
    
    setTimeout(() => {
        showStatus('Sync completed successfully!', 'success');
    }, 2000);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);