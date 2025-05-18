document.addEventListener('DOMContentLoaded', function () {
    // Initial tasks data
   let tasks=[]
    if (localStorage.getItem('taskData')) {
    try {
        const parsed = JSON.parse(localStorage.getItem('taskData'));
        tasks = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
            tasks = [
        { id: 3, title: 'Task3', priority: 'Medium', deadline: '2025-04-03', completed: false },
        { id: 1, title: 'Task1', priority: 'Medium', deadline: '2025-04-11', completed: false },
        { id: 2, title: 'Task2', priority: 'Medium', deadline: '2025-05-11', completed: false }
       ];
    }
}

    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
   
    // Render initial tasks
    renderTasks();

    // Add task event listener
    addTaskBtn.addEventListener('click', function () {
        const taskTitle = document.getElementById('taskTitle').value.trim();
        const priority = document.getElementById('priority').value;
        const deadline = document.getElementById('deadline').value;
        console.log("hi")
        if (!taskTitle) {
            alert('Please enter a task title');
            return;
        }
        //creating an new object to the add the in the todo list 
        const newTask = {
            id: Date.now(),
            title: taskTitle,
            priority: priority,
            deadline: deadline,
            completed: false
        };

        tasks.unshift(newTask);
        localStorage.setItem('taskData',JSON.stringify(tasks))
        renderTasks();

        // Clear the form
        document.getElementById('taskTitle').value = '';
        document.getElementById('priority').value = 'Medium';   
        document.getElementById('deadline').value =''
    });

    // Filter event listeners
    statusFilter.addEventListener('change', renderTasks);
    priorityFilter.addEventListener('change', renderTasks);
    
    function renderTasks() {
        const statusValue = statusFilter.value;   
        const priorityValue = priorityFilter.value;

        // Filter tasks
        const filteredTasks = tasks.filter(task => {
            const statusMatch = statusValue === 'All' ||
                (statusValue === 'Completed' && task.completed) ||
                (statusValue === 'Pending' && !task.completed);

            const priorityMatch = priorityValue === 'All' || task.priority === priorityValue;

            return statusMatch && priorityMatch;
        });
        console.log(filteredTasks)  
      
        // Clear the task list
        taskList.innerHTML = '';

        // Render each task
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';

            // Calculate days difference
            const today = new Date();
            const deadlineDate = new Date(task.deadline);
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let dueDateText = '';
            let dueDateClass = '';

            if (diffDays < 0) {
                dueDateText = 'Overdue';
                dueDateClass = 'overdue';
            } else if (diffDays <= 3) {
                dueDateText = 'Due soon';
                dueDateClass = 'due-soon';
            } else {
                dueDateText = `Due in ${diffDays} days`;
            }

            // Format date to MM/DD/YYYY
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            };

            taskItem.innerHTML = `
            <div class="task-header">
              <div style="display: flex; align-items: center;">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                  onchange="toggleTaskCompletion(${task.id})">
                <span class="task-title">${task.title}</span>
              </div>
              <div class="task-actions">
                <button class="btn-icon" onclick="editTask(${task.id})">✏️</button>
                <button class="btn-icon" onclick="deleteTask(${task.id})">🗑️</button>
              </div>
            </div>
            <div class="task-details">
              <span class="priority-tag">${task.priority}</span>
              <div class="task-detail">
                <span>📅</span>
                <span>${formatDate(task.deadline)}</span>
              </div>
              <div class="task-detail ${dueDateClass}">
                <span>⏱️</span>
                <span>${dueDateText}</span>
              </div>
            </div>
          `;

            taskList.appendChild(taskItem);   
            
        });
    }

    // Global functions for task actions
    window.toggleTaskCompletion = function (taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            localStorage.setItem("taskData",JSON.stringify(tasks)); 
            renderTasks();
        }
    };

    window.editTask = function (taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('priority').value = task.priority;
            document.getElementById('deadline').value = task.deadline;

            // Remove the task
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            tasks.splice(taskIndex, 1);
            localStorage.setItem("taskData",JSON.stringify(tasks)); 
           
            renderTasks();
        }

    };

    window.deleteTask = function (taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
             localStorage.setItem("taskData",JSON.stringify(tasks)); 
            renderTasks();
        }
    };
});
