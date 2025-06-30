document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.querySelector('.todoList');
    const addBtn = document.querySelector('.addBtn');
    const searchInput = document.querySelector('.searchInput');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach(function (task, index) {
            // Tworzenie elementów listy
            const li = document.createElement('li');
            const taskSpan = document.createElement('span');
            const dateSpan = document.createElement('span');
            const deleteBtn = document.createElement('button');
            const trashIcon = document.createElement('img');
            
            taskSpan.textContent = task.text;
            trashIcon.src = 'trashicon.png';
            trashIcon.alt = 'Usuń';
            trashIcon.classList.add('trash-icon');
            taskSpan.classList.add('task-text');
            deleteBtn.appendChild(trashIcon);
            deleteBtn.classList.add('deleteBtn');

            if (task.date) {
                dateSpan.textContent = `${task.date}`;
                dateSpan.classList.add('task-date');
            }

            // Dodanie przycisku Usuń
            deleteBtn.onclick = function () {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderTasks();
            };

            taskSpan.onclick = function () {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = task.text;
                li.replaceChild(input, taskSpan);

                const dateInput = document.createElement('input');
                dateInput.type = 'date';
                dateInput.value = task.date;
                li.replaceChild(dateInput, dateSpan);

                input.onblur = function () {
                    const newText = input.value.trim();
                    const newDate = dateInput.value;

                    if (newText.length >= 3 && newText.length <= 255) {
                        tasks[index].text = newText;
                        tasks[index].date = newDate;
                        localStorage.setItem('tasks', JSON.stringify(tasks));
                        renderTasks();
                    } else {
                        renderTasks();
                    }
                };
                dateInput.onblur = function () {
                    const newDate = dateInput.value;
                    tasks[index].date = newDate;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                };
            };

            li.appendChild(taskSpan);
            li.appendChild(dateSpan);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    // Dodawanie nowego zadania
    addBtn.onclick = function () {
        const taskInput = document.querySelector('.newTask');
        const dateInput = document.querySelector('.newDate');
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;

        if (taskText.length >= 3 && taskText.length <= 255 && (taskDate === '' || new Date(taskDate) > new Date())) {
            tasks.push({ text: taskText, date: taskDate });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            dateInput.value = '';
            renderTasks();
        } else {
            alert('Błędne zadanie lub data');
        }
    };

    // Wyszukiwanie zadań
    searchInput.oninput = function () {
        const filter = searchInput.value.trim().toLowerCase();
        if (filter.length >= 2) {
            const filteredTasks = tasks.filter(function (task) {
                return task.text.toLowerCase().includes(filter);
            });
            taskList.innerHTML = '';
            filteredTasks.forEach(function (task) {
                const li = document.createElement('li');
                const taskSpan = document.createElement('span');
                const dateSpan = document.createElement('span');

                const highlightedText = task.text.replace(new RegExp(filter, 'gi'), (match) => `<mark>${match}</mark>`);
                taskSpan.innerHTML = highlightedText;
                
                taskSpan.classList.add('task-text');

                if (task.date) {
                    dateSpan.textContent = `${task.date}`;
                    dateSpan.classList.add('task-date');
                }

                li.appendChild(taskSpan);
                li.appendChild(dateSpan);
                taskList.appendChild(li);
            });
        } else {
            renderTasks();
        }
    };

    renderTasks();
});
