var express = require('express');
var router = express.Router();
const md5=require('blueimp-md5')

const {UserModel,ChatModel}=require('../db/models');
const filter={password:0,__v:0}//指定过滤的属性

router.post('/register',function (req,res) {
  const {username,password,type}=req.body;
  UserModel.findOne({username},function (error,user) {
    if(user){
      res.send({code:1,msg:'此用户已存在，请直接登录'})
    }else{
      new UserModel({username,type,password:md5(password)}).save((error,user)=>{
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})
        res.send({code:0,data:{_id:user._id,username,type}})
      })
    }
  })
})

router.post('/login',function (req,res) {
  const {username,password}=req.body;
  UserModel.findOne({username,password:md5(password)},filter,function (error,user) {
    if(user){
      res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
      res.send({code:0,data:user})
    }else{
      res.send({code:1,msg:"用户名或密码出错!"})
    }
  })
})

router.post('/update',function (req,res) {
  const user=req.body;
  const userid=req.cookies.userid;
  if(!user_id){
   return res.send({code:1,msg:'请先登录！'})
  }
  UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {
    if(!oldUser){
      res.clearCookie('userid');
      res.send({code:1,msg:'请先登录！'})
    }else{
      const data=Object.assign(oldUser,user);
      res.send({code:0,data})
    }
  })

})

router.get('/user',function (req,res) {
  const userid=req.cookies.userid;
  if(!userid){
    res.send({code:1,msg:'请先登录'})
  }else{
    UserModel.findOne({_id:userid},filter,function (error,user) {
      res.send({code:0,data:user})
    })
  }
})

router.get('/userlist',function (req,res) {
  const {type}=req.query
  UserModel.find(type,filter,function (error,users) {
    res.send({code:0,data:users})
  })
})

router.get('/msglist', function (req, res) {
  const userid = req.cookies.userid
  UserModel.find(function (err, userDocs) {

    const users=userDocs.forEach((users,user)=>{
      users[user._id] = {username: user.username, header: user.header}
    },{})
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })

  })
})

router.post('/readmsg', function (req, res) {
  const from = req.body.from
  const to = req.cookies.userid

  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err,
                                                                                   doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})

module.exports = router;
