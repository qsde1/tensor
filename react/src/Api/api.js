import axios from "axios";
import cookie from "cookiejs";
import { httpDevUrl } from "../cfg";

export const apiAxios = axios.create({
    baseURL: httpDevUrl,
    withCredentials: true,
});

export async function reset(){
    console.log('reset');
    await apiAxios.get('/reset');
    return
}

export async function updateUserCookie(){
    let token = cookie.get('token')

    if(token === false)
        return false

    await apiAxios.get('/check-user', {
        headers: {
            'cookie_token': token
        },
    })
        .then(res=>{})
        .catch(err=>cookie.remove('token'))
}

export async function get_user_by_token(){
    let result
    await apiAxios.get(
        `/users/get-user-by-token`,
        {
            headers: {
                'cookie_token': cookie.get('token')
            },
        }
    )
    .then(res=>result = res)
    .catch(res=>result = res)
    return result
}

export async function get_projects(){
    let result = await apiAxios.get('/projects', {headers: {
        'cookie_token': cookie.get('token')
    }});

    if(result.status == 200)
        return result.data;

    return [];
}

export async function create_project(pojectObj){    
    await apiAxios.post('/projects/create', {...pojectObj},{headers: {'cookie_token': cookie.get('token')}})
    .then(res => console.log(res))
    .catch(err => console.log(err));
}

export async function delete_project(projectId){
    let result
    await apiAxios.get(
        `/project/${projectId}/delete`,
        {
            headers: {'cookie_token': cookie.get('token')}
        }
    )
    .then(res=>result = res)
    .catch(res=>result = res)
    return result
}

export async function get_project_link_invite(project_id){
    let result
    await apiAxios.get(
        `/project/${project_id}/link-invite`,
        {
            headers:{'User_id': cookie.get('user_id')},
        }
    )
    .then(res=>result = res)
    .catch(res=>result = res)
    return result
}

export async function join_user_to_project(link){
    let result
    await apiAxios.get(
        `/projects/join/${link}/add-user-to-project`,
        {
            headers:{'cookie_token': cookie.get('token')},
        }
    )
    .then(res=>result = res)
    .catch(res=>result = res)
    return result
}

export async function get_backlog_by_project_id(projectId){
    let result
    await apiAxios.get(
        `/backlog/${projectId}`,
        {
            headers: {'Cookie_token': cookie.get('token')},
        }
    )
    .then(res=>result = res)
    .catch(res=>result = res)
    return result
}