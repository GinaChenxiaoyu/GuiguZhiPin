/*包含了n个接口请求的函数的模块
  函数返回值为promise
*/
import ajax from './ajax'

export const reqRegister=(user)=>ajax('/api/register',user,'POST')

export const reqLogin=({username,password})=>ajax('/api/login',{username,password},'POST')

export const reqUpdateUser=(user)=>ajax('/api/update',user,'POST')

export const reqUser=()=>ajax('/api/user')

export const reqUserList=(type)=>ajax('/api/userlist',{type})

export const reqChatMsgList=()=>ajax('/api/msglist')

export const reqReadMsg=(from)=>ajax('/api/readmsg',from,'POST')
