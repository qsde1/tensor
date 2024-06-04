import cookie from "cookiejs";
import { action, makeAutoObservable } from "mobx";
import { wsUrl } from "../cfg";
class TaskListsStore{
    taskLists = null
    socket = null
    backlogId = null
    isStoreReady = false
    constructor(backlogId){
        makeAutoObservable(this)
        this.backlogId = backlogId;
    }

    connect = () => {
        let ws = new WebSocket(`${wsUrl}/ws/${cookie.get('token')}/backlog/${this.backlogId}/tasks-lists`)
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
            let res =  JSON.parse(e.data)
            switch(res.action){
                case 'return-task-lists':
                    this.setTaskLists(res.data);
                    break;
                case 'task-list-addet':
                    this.getTaskLists();
                    break;
                case 'exception':
                    console.log(res.data);
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

    getTaskLists = () => {
        this.socket.send(JSON.stringify({
            action: 'get-task-lists-by-backlog-id'
        }))
    }

    createTaskList = (taskList) => {
        this.socket.send(JSON.stringify({
            action: 'create-task-list',
            data: taskList
        }))
    }

    setTaskLists = (taskLists) => {
        this.taskLists = taskLists;
    }

    setIsStoreReady = (is) => {
        this.isStoreReady = is;
    }


    // get isStoreReady(){
    //     return this.socket && this.socket.readyState == WebSocket.OPEN;
    // }


}

export default TaskListsStore