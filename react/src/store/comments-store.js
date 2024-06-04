import cookie from "cookiejs";
import { action, makeAutoObservable } from "mobx";
import { wsUrl } from "../cfg";

class CommentsStore{
    isStoreReady = false
    socket = null
    comments = null
    taskId=null
    constructor(taskId){
        makeAutoObservable(this)
        this.taskId = taskId
    }

    connect = () => {
        let ws = new WebSocket(`${wsUrl}/ws/${cookie.get('token')}/task/${this.taskId}`)
        this.socket = ws
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
            switch (res.action){
                case 'return-comments':
                    this.setComments(res.data)
                    break;
                case 'comment-created':
                    this.getComments()
                    break;
                }
        }
    }

    close = () => {
        this.socket.close();
    }

    setIsStoreReady = (is) => {
        this.isStoreReady = is;
    }

    getComments = () => {
        this.socket.send(JSON.stringify({action: 'get-comments'}))
    }

    setComments = (comments) => {
        this.comments = comments
    }

    createComment = (comment) => {
        this.socket.send(JSON.stringify({
            action: 'create-comment',
            data: {comment},
        }))
    }

}

export default CommentsStore