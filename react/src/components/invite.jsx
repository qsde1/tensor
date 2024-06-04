import cookie from "cookiejs"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { join_user_to_project } from "../Api/api"


//барахло, не трогаем
const Invite = () => {
    const { link } = useParams()
    const navigate = useNavigate()

    
    useEffect(()=>{
        (async ()=> {
            let user_id = cookie.get('user_id')
            let result = await join_user_to_project(link);
            if(result.status == 200)
                return navigate('/projects')
        })()
    })
}

export default Invite
