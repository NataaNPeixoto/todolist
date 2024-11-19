class Todo {
    constructor() {
        this.totalTasks = document.querySelectorAll('.task').length;
        this.loadTasks();  // Carregar tarefas salvas na localStorage ao iniciar
    }

    addTask(taskText, isDone = false) {
        // Clonar a task inteira
        let template = document.querySelector('.task').cloneNode(true);
        // Remover a classe hide
        template.classList.remove('hide');
        // Manipular o texto
        let templateText = template.querySelector('.task-title');
        templateText.textContent = taskText;

        if(isDone) {
            template.querySelector('.fa-check').classList.add('done');  // Marcar como completa se necessário
        }

        let list = document.querySelector('#tasks-container');
        
        // Inserir a task na lista
        list.appendChild(template);

        // Adicionar eventos (remover e completar)
        this.addEvents(template);  // Chama a função para adicionar eventos aos botões

        this.checkTasks('add');
        this.saveTasks();  // Salva a lista de tarefas na localStorage
    }

    removeTask(task) {
        // Achar o elemento pai (div.task)
        let parentEl = task.parentElement;

        // Remover da lista
        parentEl.remove();

        this.checkTasks('remove');
        this.saveTasks();  // Salva a lista de tarefas na localStorage
    }

    completeTask(task) {
        // adiciona a classe de done
        task.classList.toggle('done');

        // Reorganizar as tarefas
        let taskElement = task.parentElement;
        let list = document.querySelector('#tasks-container');
        let title = list.querySelector('h2');

        if(task.classList.contains('done')) {
            list.insertBefore(taskElement, title.nextSibling);  // Move a tarefa para abaixo do título se marcada como completa
        } else {
            list.append(taskElement);  // Move a tarefa para o final da lista se desmarcada
        }

        this.saveTasks();  // Salva a lista de tarefas na localStorage
    }

    addEvents(taskElement) {
        // Pegar os botões de remover e completar tarefas da task recém-adicionada
        let removeBtn = taskElement.querySelector('.fa-trash');
        let doneBtn = taskElement.querySelector('.fa-check');

        // Adicionar evento de remover tarefa
        removeBtn.addEventListener('click', () => {
            this.removeTask(removeBtn);
        });

        // Adicionar evento de completar tarefa
        doneBtn.addEventListener('click', () => {
            this.completeTask(doneBtn);
        });
    }

    checkTasks(command) {
        let list = document.querySelector('#tasks-container');
        let empty = list.querySelector('#empty-tasks');

        // lógica de adicionar ou remover tasks
        if(command === 'add') {
            this.totalTasks += 1;
        } else if(command === 'remove') {
            this.totalTasks -= 1;
        }

        // Verifica se há apenas uma tarefa na lista.
        // Se houver apenas uma, remove a classe 'hide' do elemento empty, mostrando-o.
        // Caso contrário, adiciona a classe 'hide' ao elemento, ocultando-o.
        this.totalTasks == 1 ? empty.classList.remove('hide') : empty.classList.add('hide');
    }

    saveTasks() {
        let tasks = [];
        document.querySelectorAll('.task').forEach(task => {
            if(!task.classList.contains('hide')) {
                let taskText = task.querySelector('.task-title').textContent;
                let isDone = task.querySelector('.fa-check').classList.contains('done');
                tasks.push({ text: taskText, done: isDone });
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));  // Salva a lista de tarefas na localStorage
    }

    loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => this.addTask(task.text, task.done));  // Carrega as tarefas da localStorage
    }
}

let todo = new Todo();

let addBtn = document.querySelector('#add');

addBtn.addEventListener('click', function(e) {
    e.preventDefault();
    let taskText = document.querySelector('#task');

    if(taskText.value !== '') {
        todo.addTask(taskText.value);
    }

    // Limpar campo de texto
    taskText.value = "";
});
