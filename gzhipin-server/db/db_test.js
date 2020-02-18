const md5=require('blueimp-md5');
const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/gzhipin_test")
const conn=mongoose.connection
conn.on('connected',function () {
  console.log('数据库连接成功，欧耶~~~')
})

const UserSchema=mongoose.Schema({
  username:{type:String,required:true},
  password:{type:String,required:true},
  type:{type:String,required:true},
  header:{type:String}
})
const UserModel=mongoose.model('user',UserSchema)
//1.通过Model实例的save()添加数据
function testSave() {
  const userModel=new UserModel({username:'Gina',password:md5('666'),type:'laoban'})
  userModel.save(function (error,user) {
    console.log('save()',error,user)
  })
}
//testSave()
//2.通过Model的find()/findOne()查询多个或一个数据
function testFind() {
  //把所有的查出来
  UserModel.find({"_id" : "5e40bef75bad8e6dc8313821"},function (error,users) {
    console.log('find()',error,users)
  })
  UserModel.findOne({"_id" : "5e40bef75bad8e6dc8313821"},function (error,user) {
    console.log('findOne()',error,user)
  })
}
//testFind()
//3.通过Model的findByIdAndUpdate()更新某个数据
function testUpdate() {
  UserModel.findByIdAndUpdate({"_id" : "5e40bef75bad8e6dc8313821"},{username:"Muyou"},function (error,oldUser) {
    console.log("testUpdate()",error,oldUser)
  })
}
//testUpdate()
//4.通过Model的remove()删除匹配的数据
function testRemove() {
  UserModel.remove({"_id" : "5e40bef75bad8e6dc8313821"},function (error,doc) {
    console.log("remove()",error,doc)
  })
}
testRemove()
