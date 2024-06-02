import cookie from "cookiejs";
import { action, makeAutoObservable } from "mobx";
class TasksStore{
    tasksListId = null
    tasks = null
    taskList = null
    socket = null
    isStoreReady = false
    constructor(tasksListId){
        makeAutoObservable(this);
        this.tasksListId = tasksListId;
    }

    connect = () => {
        let ws = new WebSocket(`ws://localhost:8000/ws/${cookie.get('token')}/task-list/${this.tasksListId}`)
        this.setSocket(ws);
        ws.onopen = (e) => {
            console.log(e);
            this.setIsStoreReady(true)
        }
        ws.onclose = (e) => {
            this.setIsStoreReady(false);
            console.log(e);
        }
        ws.onmessage = (e) => {
            let res = JSON.parse(e.data)
            switch (res.action) {
                case 'return-task-list':
                    this.setTaskList(res.data);
                    break;
                case 'return-tasks':
                    this.setTasks(res.data);
                    break;
                case 'task-created':
                case 'task-deleted':
                case 'status-task-changed':
                case 'executor-addet':
                    this.getTasks();
                    break;
                default:
                    break;
            }
        }
    }

    close = () => {
        this.socket.close();
    }

    setSocket = (socket) => {
        this.socket = socket;
    }

    setIsStoreReady = (is) => {
        this.isStoreReady = is;
    }

    getTaskList = () => {
        this.socket.send(JSON.stringify({action: 'get-task-list'}))
    }

    setTaskList = (taskList) => {
        this.taskList = taskList;
    }

    getTasks = () => {
        this.socket.send(JSON.stringify({action: 'get-tasks'}))
    }

    setTasks = (tasks) => {
        this.tasks = tasks;
    }

    createTask = (task) => {
        this.socket.send(JSON.stringify({
            action: 'create-task',
            data: task
        }))
    }

    deleteTask = (taskId) => {
        this.socket.send(JSON.stringify({
            action: 'delete-task',
            data: {taskId}
        }))
    }

    addTaskExecutor = (taskId, executorId) => {
        console.log(taskId, executorId);
        this.socket.send(JSON.stringify({
            action: 'add-task-executor',
            data: {
                taskId,
                executorId,
            }
        }))
    }

    changeStatusTask = (taskId, statusId) => {
        this.socket.send(JSON.stringify({
            action: 'change-status-task',
            data: {taskId, statusId}
        }))
    }

}

export default TasksStore