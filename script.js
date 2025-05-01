function updateTime(){
    const now = new Date();
    const option = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("time").textContent = now.toLocaleString('id-ID', option);
}

//reset task lists before rendering new tasks//
function clearTaskLists(){
    document.getElementById("todoList").innerHTML = "";
    document.getElementById("doneList").innerHTML = "";
    document.getElementById("overdueList").innerHTML = "";
}

function saveTasksToLocalStorage(tasks){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
}

function renderTasks(tasks){
    const todoList = document.getElementById("todoList");
    const doneList = document.getElementById("doneList");
    const overdueList = document.getElementById("overdueList");
    
    //call function to clear the task lists before rendering new tasks//
    clearTaskLists();

    /* todoList.innerHTML = "";
    doneList.innerHTML = "";
    overdueList.innerHTML = ""; */
    
    const todayDate =  new Date(new Date().toISOString().slice(0, 10));

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "flex items-center gap-2 p-2 rounded-lg border bg-white";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function () {
        task.completed = this.checked;
        saveTasksToLocalStorage(tasks);
        renderTasks(tasks);
        });

        const taskTextEl = document.createElement("span");
        taskTextEl.textContent = `[${task.priority}] ${task.text}`;

        if (task.completed) {
        taskTextEl.classList.add("line-through", "text-gray-400");
        }

        const dueDateEl = document.createElement("span");
        dueDateEl.className = "text-xs text-gray-500";
        dueDateEl.textContent = ` (Deadline: ${task.dueDate})`;

        taskElement.appendChild(checkbox);
        taskElement.appendChild(taskTextEl);
        taskElement.appendChild(dueDateEl);

        const due = new Date(task.dueDate);
        if (task.completed) {
            doneList.appendChild(taskElement);
        } else if (due < todayDate) {
            const overdueLabel = document.createElement("span");
            overdueLabel.className = "ml-2 text-red-500 font-semibold text-sm";
            overdueLabel.textContent = "[Overdue]";
            taskElement.appendChild(overdueLabel);
            overdueList.appendChild(taskElement);
        } else {
            todoList.appendChild(taskElement);
        }
    });
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;
    const taskText = taskInput.value.trim();

    //check if task and due date are empty//
    if (taskText === "" || dueDate === "") {
        alert("Mohon isi tugas dan tanggal deadline!");
        return;
    }

    const tasks = loadTasksFromLocalStorage();
    tasks.push({ text: taskText, priority: priority, dueDate: dueDate, completed: false });
    saveTasksToLocalStorage(tasks);
    renderTasks(tasks);

    taskInput.value = "";
    document.getElementById("dueDate").value = "";
}

function clearAllTasks() {
    localStorage.removeItem('tasks');
    renderTasks([]);
}

updateTime();
renderTasks(loadTasksFromLocalStorage());