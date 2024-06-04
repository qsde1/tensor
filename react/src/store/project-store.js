import cookie from "cookiejs";
import { action, makeAutoObservable } from "mobx";
import { wsUrl } from "../cfg";
export default class ProjectStore{
    socket = null;
    projectId = null;
    project = null;
    creator = null;
    currentUserRole = null;
    users = null;
    statuses = null;    
    colors = null;
    isStoreReady = false;
    exceptionMessage = null;
    constructor(projectId){
        makeAutoObservable(this);
        this.projectId = projectId;
    }

    connect = () => {
        let ws = new WebSocket(`${wsUrl}/ws/${cookie.get('token')}/project/${this.projectId}`)
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
                case 'return-project':
                    this.setProject(res.data);
                    break;
                case 'return-creator':
                    this.setCreator(res.data);
                    break;
                case 'return-statuses':
                    this.setStatuses(res.data);
                    break;
                case 'statuses-changed':
                    this.getStatuses();
                    break;
                case 'return-users':
                    this.setUsers(res.data);
                    break;
                case 'return-current-user-role':
                    this.setCurrentUserRole(res.data);
                    break;
                case 'user-addet':
                    this.getUsers();
                    break;
                case 'return-colors':
                    this.setColors(res.data);
                    break;
                case 'exception':
                    console.log(res.data);
                    this.setExceptionMessage(res.data.msg);
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

    getProject = () => {
        this.socket.send(JSON.stringify({action: 'get-project'}));
    }
    
    setProject = (project) => {
        this.project = project;
    }
    
    getCreator = () => {
        this.socket.send(JSON.stringify({action: 'get-creator'}));
    }

    setCreator = (creator) => {
        this.creator = creator;
    }

    getStatuses = () => {
        this.socket.send(JSON.stringify({action: 'get-statuses'}));
    }

    setStatuses = (statuses) => {
        this.statuses = statuses;
    }

    getCurrentUserRole = () => {
        this.socket.send(JSON.stringify({action: 'get-current-user-role'}));
    }

    setCurrentUserRole = (currentUserRole) => {
        this.currentUserRole = currentUserRole;
    }

    getColors = () => {
        this.socket.send(JSON.stringify({action: 'get-colors'}));
    }

    setColors = (colors) => {
        this.colors = colors;
    }

    getUsers = () => {
        this.socket.send(JSON.stringify({action: 'get-users'}))
    }

    setUsers = (users) => {
        this.users = users;
    }

    createStatus = (status) => {
        this.socket.send(JSON.stringify({
            action: 'create-status',
            data: status
        }))
    }

    swapStatuses = (statusOneId, statusTwoId) => {
        this.socket.send(JSON.stringify({
            action: 'swap-statuses',
            data: {statusOneId, statusTwoId}
        }))
    }

    deleteStatus = (statusId) => {
        this.socket.send(JSON.stringify({
            action: 'delete-status',
            data: {statusId}
        }))
    }

    setExceptionMessage = (msg) => {
        this.exceptionMessage = msg        
    }

    setIsStoreReady = (is) => {
        this.isStoreReady = is;
    }
}