/**
 * Created by yulingjie on 17/10/10.
 */
import React,{Component} from 'react'
import {Mask} from './popOver'
import {Toast} from 'antd-mobile/lib'
import {fetchJson} from './fetch'
import {matchMobile} from './functional'

//注册内容
class Register extends Component{
	handleChange() {
		this.props.importMobile(this.refs.mobileInput.value);
		this.props.importCode(this.refs.codeInput.value);
	}
	render() {
		return(
			<div className="register">
				<span className="iconfont icon-close" onClick={this.props.close}></span>
				<img
					src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/register.png"
			        alt="topImg"
				/>
				<div className="register-board">
					<input
						type="text"
						placeholder="请输入手机号"
						pattern="[0-9]*"
						ref="mobileInput"
						value={this.props.mobile}
					    onChange={this.handleChange.bind(this)}/>
					<input
						type="text"
						pattern="[0-9]*"
						ref="codeInput"
					    value={this.props.code}
					    onChange={this.handleChange.bind(this)}
					/>
					<div className="getCode" onClick={this.props.getCode}>
						<p>{this.props.codeText}</p>
					</div>
					<div className="btn-submit" onClick={this.props.register}>
						<p>提交</p>
					</div>
				</div>
			</div>
		)
	}
}

//注册弹框
class SignUp extends Component{
	constructor(props) {
		super(props);
		this.state = {
			mobile: '',
			code: '',
			codeText: '获取验证码'
		}
	}
	//是否显示注册弹框
	handleClick() {
		this.props.isSignUpShown(false);
		this.setState({
			mobile: '',
			code: ''
		}); //关闭弹框时清空
	}
	//获取验证码
	getCode() {
		//只有当文字是获取验证码时才能调用
		if(this.state.codeText === '获取验证码') {
			//匹配手机号
			if(matchMobile().test(this.state.mobile)) {
				fetchJson('/makeidentifycode',{mobile: this.state.mobile},(msg) => {
					console.log(msg.message)
					if(msg.message === 'success') {
						let count = 60;
						let self = this;
						this.timer = setInterval(() => {
							if(count > 0) {
								self.setState({codeText: `${count}秒后重发`});
								count --;
							}else{
								self.setState({codeText: '获取验证码'});
								clearInterval(this.timer);
							}
						},1000);
					}
				});
			}else{
				Toast.info('手机号码输入有误,请重新输入!',1.5)
			}
		}
	}
	mobileChange(e) {
		this.setState({mobile: e});
	}
	codeChange(e) {
		this.setState({code: e});
	}
	//提交按钮
	register() {
		fetchJson('/verifyidentifycode',{
			mobile: this.state.mobile,
			icode: this.state.code
		},(msg) => {
			if(msg.message === 'success') {
				fetchJson('/owner/registOwner',{
					openid: this.props.openid,
					mobile: this.state.mobile,
					icode: this.state.code
				},(res) => {
					if(res.message === 'success') {
						this.props.isSignUpShown(false);
						Toast.info('登录成功!',1);
					}else{
						Toast.info('登录失败,请稍后重试!',1);
					}
				});
			}else{
				Toast.info('验证码填写有误,请重新输入!',1.5);
			}
		});
	}
	render() {
		return(
			<div className="signUp">
				<Register
					close={this.handleClick.bind(this)}
				    getCode={this.getCode.bind(this)}
					importMobile={this.mobileChange.bind(this)}
					importCode={this.codeChange.bind(this)}
					mobile={this.state.mobile}
					code={this.state.code}
				    codeText={this.state.codeText}
				    register={this.register.bind(this)}
				/>
				<Mask onClick={this.handleClick.bind(this)}/>
			</div>
		)
	}
}

export default SignUp;
