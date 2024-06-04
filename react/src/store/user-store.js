import { get_user_by_token } from "../Api/api";
import { action, makeAutoObservable } from "mobx";

class UserStore {
    user = null;
    constructor(){
        makeAutoObservable(this)
        this.getCurrentUser();
    }

    getCurrentUser = async () => {
        let result = await get_user_by_token();
        if(result.status == 200){
            this.setUser(result.data);
        }
    }

    setUser = (user) => {
        this.user = user;
    }

    get storeIsReady(){
        return this.user;
    }
}

export default UserStore;