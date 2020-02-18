// 注册--路由组件
import React,{Component} from 'react'
import {connect} from 'react-redux'
import{Redirect} from 'react-router-dom'
import {register} from '../../redux/actions'
import{
    NavBar,
    WingBlank,
    List,
    WhiteSpace,
    InputItem,
    Radio,
    Button
}from 'antd-mobile'

import Logo from '../../components/logo/logo'

const ListItem=List.Item
class Register extends Component{
  state={
    username:'',
    password:'',
    password2:'',
    type:'dashen'
  }
  handleChange=(type,val)=>{
    this.setState({
      [type]:val
    })
  }
  register=()=>{
    this.props.register(this.state);
  }
  login=()=>{
    this.props.history.replace("./login")
  }
  render(){
    const {type}=this.state;
    const {msg,redirectTo}=this.props.user;
    if(redirectTo){
      return <Redirect to={redirectTo}></Redirect>
    }
    return (
        <div>
              <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
              <Logo/>
              <WingBlank>
                <List>
                  {msg?<div className="error-msg">{msg}</div>:null}
                  <WhiteSpace/>
                  <InputItem placeholder='请输入用户名' onChange={val=>this.handleChange("username",val)}>用户名:</InputItem>
                  <WhiteSpace/>
                  <InputItem placeholder='请输入用密码' type='password' onChange={val=>this.handleChange("password",val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
                  <WhiteSpace/>
                  <InputItem placeholder='请输入用确认密码' type='password' onChange={val=>this.handleChange("password2",val)}>确认密码：</InputItem>
                  <WhiteSpace/>
                  <ListItem>
                    <span>用户类型：</span>&nbsp;&nbsp;
                    <Radio checked={type==="dashen"} onChange={val=>this.handleChange("type","dashen")}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Radio checked={type==="laoban"} onChange={val=>this.handleChange("type","laoban")}>老板</Radio>
                  </ListItem>
                  <WhiteSpace/>
                  <Button type="primary" onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                  <Button onClick={this.login}>已有账户</Button>
                </List>
              </WingBlank>
        </div>
    )
  }
}

export default connect(
    state=>({user:state.user}),
    {register}
)(Register)
