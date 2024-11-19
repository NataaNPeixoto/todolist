// Classe principal para gerenciar as tarefas
class Todo {

    constructor() {
        this.totalTasks = document.querySelectorAll('.task').length;
        this.loadTasks();  // Carrega tarefas salvas na localStorage ao iniciar
    }

    // Função para adicionar uma nova tarefa
    addTask(taskText, isDone = false) {
        let template = document.querySelector('.task').cloneNode(true);
        template.classList.remove('hide');
        template.classList.add('adding');
        template.querySelector('.fa-check').classList.remove('done');
        template.querySelector('.task-title').textContent = taskText;

        if(isDone) {
            template.querySelector('.fa-check').classList.add('done');
        }

        document.querySelector('#tasks-container').appendChild(template);
        setTimeout(() => template.classList.add('active'), 10);

        this.addEvents(template);
        this.checkTasks('add');
        this.saveTasks();
    }

    // Função para remover uma tarefa
    removeTask(task) {
        let parentEl = task.parentElement;
        parentEl.classList.add('removing');
        setTimeout(() => {
            parentEl.remove();
            this.checkTasks('remove');
            this.saveTasks();
        }, 300);
    }

    // Função para marcar ou desmarcar uma tarefa como completa
    completeTask(task) {
        task.classList.toggle('done');

        let taskElement = task.parentElement;
        let list = document.querySelector('#tasks-container');
        let title = list.querySelector('h2');

        if(task.classList.contains('done')) {
            list.insertBefore(taskElement, title.nextSibling);
        } else {
            list.append(taskElement);
        }

        this.saveTasks();
    }

    // Função para adicionar eventos de clique aos botões de completar e remover tarefa
    addEvents(taskElement) {
        let removeBtn = taskElement.querySelector('.fa-trash');
        let doneBtn = taskElement.querySelector('.fa-check');

        removeBtn.addEventListener('click', () => {
            this.removeTask(removeBtn);
        });

        doneBtn.addEventListener('click', () => {
            this.completeTask(doneBtn);
        });
    }

    // Função para verificar o estado das tarefas e atualizar a visibilidade do aviso de "Nenhuma tarefa"
    checkTasks(command) {
        let list = document.querySelector('#tasks-container');
        let empty = list.querySelector('#empty-tasks');

        if(command === 'add') {
            this.totalTasks += 1;
        } else if(command === 'remove') {
            this.totalTasks -= 1;
        }

        this.totalTasks == 1 ? empty.classList.remove('hide') : empty.classList.add('hide');
    }

    // Função para salvar tarefas no localStorage
    saveTasks() {
        let tasks = [];
        document.querySelectorAll('.task').forEach(task => {
            if(!task.classList.contains('hide')) {
                let taskText = task.querySelector('.task-title').textContent;
                let isDone = task.querySelector('.fa-check').classList.contains('done');
                tasks.push({ text: taskText, done: isDone });
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para carregar tarefas do localStorage
    loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => this.addTask(task.text, task.done));
    }
}

// Instanciação da classe Todo
let todo = new Todo();

// Adicionar evento ao botão de adicionar tarefa
let addBtn = document.querySelector('#add');
addBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let taskInput = document.querySelector('#task');
    let taskText = taskInput.value.trim();

    if(taskText !== '') {
        todo.addTask(taskText);
        taskInput.value = "";
    } else {
        alert("Por favor, insira uma tarefa válida!");
    }
});
