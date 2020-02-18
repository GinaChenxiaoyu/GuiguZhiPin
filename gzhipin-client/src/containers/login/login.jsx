// 注册--路由组件
import React,{Component} from 'react'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'
import{Redirect} from 'react-router-dom'
import{
  NavBar,
  WingBlank,
  List,
  WhiteSpace,
  InputItem,
  Button
}from 'antd-mobile'
class Login extends Component{
  state={
    username:'',
    password:''
  }
  handleChange=(type,val)=>{
    this.setState({
      [type]:val
    })
  }
  login=()=>{
      this.props.login(this.state)
  }
  register=()=>{
    this.props.history.replace("./register")
  }
  render(){
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
              <Button type="primary" onClick={this.login}>登&nbsp;&nbsp;&nbsp;&nbsp;录</Button>
              <Button onClick={this.register}>还没有账户</Button>
            </List>
          </WingBlank>
        </div>
    )
  }
}
export default connect(
    state=>({user:state.user}),
    {login}
)(Login)
