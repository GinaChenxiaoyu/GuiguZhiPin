import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from './action-types'
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg} from '../api'
import io from 'socket.io-client'

//这两不需要直接向外部暴露，暴露异步的action就够了
const auth_success=(user)=>({type:AUTH_SUCCESS,data:user})
const error_msg=(msg)=>({type:ERROR_MSG,data:msg})
const receiveUser=(user)=>({type:RECEIVE_USER,data:user})
export const resetUser=(msg)=>({type:RESET_USER,data:msg})
const receiveUserList=(userList)=>({type:RECEIVE_USER_LIST,data:userList})
const receiveMsgList=({users,chatMsgs,userid})=>({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}})
const receiveMsg=(chatMsg)=>({type:RECEIVE_MSG,data:chatMsg})
const msgRead=({count,from,to})=>({type:MSG_READ,data:{count,from,to}})

function initIO(dispatch,userid) {
  if(!io.socket){
    io.socket=io('ws://localhost:4000')
    io.socket.on('receiveMsg',function (chatMsg) {
      if(userid===chatMsg.from||userid===chatMsg.to){
        dispatch(receiveMsg(chatMsg))
      }
    })
  }
}

async function getMsgList(dispatch,userid) {
  initIO(dispatch,userid)
  const response=await reqChatMsgList()
  const result=response.data
  if(result.code===0){
    const {users,chatMsgs}=result.data
    dispatch(receiveMsgList({users,chatMsgs,userid}))
  }
}

export const sendMsg=({from,to,content})=>{
  return dispatch=>{
    console.log('客户端向服务器发消息',{from,to,content})
    io.socket.emit('sendMsg',{from,to,content})
  }
}

export const register=(user)=>{
  const {username,password,password2,type}=user;
  //表单的前台检查
 if(!username){
    return error_msg("用户名必须指定!")
  }else if(password!==password2){
    return error_msg('两次密码输入不一致!');
  }
 return async dispatch=>{
      const response=await reqRegister({username,password,type});
      const result=response.data;
      const code=result.code;
      if(code===0){
        getMsgList(dispatch,result.data._id)
        dispatch(auth_success(result.data))
      }else{
        dispatch(error_msg(result.msg))
      }
    }
}

export const login=(user)=>{
  const {username,password}=user;
  //表单的前台检查
  if(!username){
    return error_msg("用户名必须指定!")
  }else if(!password){
    return error_msg('密码必须指定!');
  }
  return async dispatch=>{
      const response=await reqLogin(user);
      const result=response.data;
      const code=result.code;
      if(code===0){
        getMsgList(dispatch,result.data._id)
        dispatch(auth_success(result.data))
      }else{
        dispatch(error_msg(result.msg))
      }
    }
}

export const updateUser=(user)=>{
  return async dispatch=>{
    const response=await reqUpdateUser(user)
    const result=response.data
    if(result.code===0){
      dispatch(receiveUser(result.data))
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}

export const getUser=()=>{
  return async dispatch=>{
    const response=await reqUser()
    const result=response.data
    if(result.code===0){
      getMsgList(dispatch,result.data._id)
      dispatch(receiveUser(result.data))
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}

export const getUserList=(type)=>{
  return async dispatch=>{
    const response=await reqUserList(type)
    const result=response.data
    if(result.code===0){
      dispatch(receiveUserList(result.data))
    }
  }
}

export const readMsg=(from,to)=>{
  return async dispatch=>{
    const response=await reqReadMsg(from)
    const result=response.data
    if(result.code===0){
      const count=result.data
      dispatch(msgRead({count,from,to}))
    }
  }
}
