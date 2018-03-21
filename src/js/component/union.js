/**
 * Created by yulingjie on 17/9/22.
 */
import React,{Component} from 'react'
import GamePacket from './gamePacket'
import MobilePacket from './mobilePacket'
import SharePacket from './sharePacket'
import RedPacket from './redPacket'
import FriendLabel from './friendLabel'
import SharePop from './sharePop'
import {ActivityIndicator,Toast} from 'antd-mobile/lib'
import {fetchJson,getWxCodeUrl} from './fetch'
import {matchMobile,getQueryString} from './functional'
import URI from 'urijs'

//分割线
class CutLine extends Component{
	render() {
		return(
			<div className="cut-line">
				<div className="point-board">
					<div className="point-sm"></div>
					<div className="point-md"></div>
					<div className="point-md"></div>
					<div className="point-sm"></div>
				</div>
			</div>
		)
	}
}

//好友已领取奖励
class HadHelped extends Component{
	render() {
		return(
			<div className="red-packet-content">
				<p className="hadHelped">您已领取过奖励!</p>
			</div>
		)
	}
}

//分享者已领取奖励
class HadReceive extends Component{
	render() {
		return(
			<div className="red-packet-content">
				<p className="hadHelped">已有{this.props.friendNum}位好友帮您助力</p>
				<p className="hadHelped">共已获得{this.props.totalMoney}元红包</p>
			</div>
		)
	}
}

class Union extends Component{
	constructor(props) {
		super(props);
		this.state = {
			nickName: '',
			headImgUrl: '',
			friendMobile: '',
			friendOpenid: '',
			friendLists: [],
			isShare: false,
			module: <ActivityIndicator/>
		};
	}
	componentWillMount() {
		//本地存储openid,微信授权
		var openid = localStorage.getItem('openid');
		//const openid = 'oCWLqtzAU1sNABjiBcz6TSnFjhiM';
		const createAt = localStorage.getItem('createAt');
		const expire = createAt ?  new Date().getTime() - createAt : 0;
		//参见game.js
		if(!openid || !createAt || expire > 7 * 24 * 60 * 60 * 1000) {
			const uri = new URI(document.location.href);
			const query = uri.query(true);
			const {code} = query;
			if(code) {
				//此处fetchJson里面调用的接口和存在openid的情况一样,但不能写进方法调用,didmount后方法会不执行
				fetchJson('/getAccessCode', {code: code}, (msg) => {
					if(msg.message === 'success') {
						localStorage.setItem('openid', msg.data);
						localStorage.setItem('createAt', new Date().getTime());
						this.openid = msg.data;
						this.fromOpenid = getQueryString("openid") === '' ? this.openid : getQueryString("openid"); //获取url中openid值
						//获取头像和昵称
						fetchJson('/getUserWxInfoforenjoy', {openid: this.openid}, (res) => {
							//用于先输入手机号再领取的情况
							if(res.message === 'success') {
								this.setState({
									nickName: res.data.nickname,
									headImgUrl: res.data.headimgurl
								});
								//先获取领取列表
								fetchJson('/getAllgiftAccountLists',{openid: this.fromOpenid},(info) => {
									if(info.message === 'success') {
										//先计算总共获得赠金
										let totalAccount = 0;
										let openidLists = [];
										info.data.map((account) => {
											totalAccount += account.account;
											openidLists.push(account.openid);
										});
										//获取列表
										this.setState({friendLists: info.data});
										//判断该openid是否为已帮领过奖的openid,如果是
										if(openidLists.indexOf(this.openid) >= 0) {
											//判断是否是分享者,如果openid和fromOpenid相同,则是分享者,下同
											if (this.openid === this.fromOpenid) {
												this.setState({
													module: <HadReceive
														friendNum={info.data.length}
														totalMoney={totalAccount / 1000}
													/>
												})
											}else{
												this.setState({
													module: <HadHelped/>
												});
											}
										}else{
											//获取用户手机号码
											fetchJson('/getOwnerByOpenid',{openid: this.openid},(msg) => {
												if(msg.message === 'success') {
													//如果是存在业主表里,则可以找到手机号,直接领奖
													if(msg.data.docs && msg.data.docs.role === '业主') {
														localStorage.setItem('ownerid', msg.data.sessions.ownerid);
														localStorage.setItem('mobile', msg.data.sessions.mobile);
														fetchJson('/getAddMilkgiftAccount',{
															openid: this.fromOpenid, //此处是分享者的Id 需要改
															friendMobile: msg.data.sessions.mobile,
															friendOpenid: this.openid,
															nickname: res.data.nickname,
															headimgurl: res.data.headimgurl
														},(data) => {
															if(data.message === 'success') {
																//如果当前openid和url中分享的openid一致,则是分享者,否则是好友
																if(this.openid === this.fromOpenid) {
																	this.setState({
																		module: <GamePacket
																			money={data.data.giftAccount.account / 1000}
																			mobile={msg.data.sessions.mobile}
																			clickButton={this.toShare.bind(this)}
																		/>
																	});
																}else{
																	this.setState({
																		friendOpenid: this.openid,
																		module: <SharePacket
																			money={data.data.giftAccount.account / 1000}
																			mobile={msg.data.sessions.mobile}
																		/>
																	});
																}
																//获取后需重新刷新一遍列表
																fetchJson('/getAllgiftAccountLists',{
																	openid: this.fromOpenid
																},(infoRefresh) => {
																	if(infoRefresh.message === 'success') {
																		this.setState({friendLists: infoRefresh.data});
																	}
																});
															}else{
																Toast.info(data.message);
															}
														});
													}else{
														//如果点击者不是业主身份,需要先输入手机号码再调取获取赠金接口
														this.setState({
															friendOpenid: this.openid,
															module: <MobilePacket
																getMobile={this.toGetMobile.bind(this)}
																clickButton={this.toGetPacket.bind(this)}
															/>
														});
													}
												}else{
													Toast.info(msg.message);
												}
											});
										}
									}else{
										Toast.info(info.message);
									}
								});
							}else{
								Toast.info(res.message);
							}
						});
					}else{
						Toast.info(msg.message, 1.5);
					}
				});
			}else{
				document.location = getWxCodeUrl(document.location.href);
			}
		}else{
			this.openid = openid; //获取当前用户的openid
			this.fromOpenid = getQueryString("openid") === '' ? this.openid : getQueryString("openid"); //获取url中openid值
			//获取头像和昵称
			fetchJson('/getUserWxInfoforenjoy', {openid: this.openid}, (res) => {
				//用于先输入手机号再领取的情况
				if(res.message === 'success') {
					this.setState({
						nickName: res.data.nickname,
						headImgUrl: res.data.headimgurl
					});
					//先获取领取列表
					fetchJson('/getAllgiftAccountLists',{openid: this.fromOpenid},(info) => {
						if(info.message === 'success') {
							//先计算总共获得赠金
							let totalAccount = 0;
							let openidLists = [];
							info.data.map((account) => {
								totalAccount += account.account;
								openidLists.push(account.openid);
							});
							//获取列表
							this.setState({friendLists: info.data});
							//判断该openid是否为已帮领过奖的openid,如果是
							if(openidLists.indexOf(this.openid) >= 0) {
								//判断是否是分享者,如果openid和fromOpenid相同,则是分享者,下同
								if (this.openid === this.fromOpenid) {
									this.setState({
										module: <HadReceive
											friendNum={info.data.length}
											totalMoney={totalAccount / 1000}
										/>
									})
								}else{
									this.setState({
										module: <HadHelped/>
									});
								}
							}else{
								//获取用户手机号码
								fetchJson('/getOwnerByOpenid',{openid: this.openid},(msg) => {
									if(msg.message === 'success') {
										//如果是存在业主表里,则可以找到手机号,直接领奖
										if(msg.data.docs && msg.data.docs.role === '业主') {
											localStorage.setItem('ownerid', msg.data.sessions.ownerid);
											localStorage.setItem('mobile', msg.data.sessions.mobile);
											fetchJson('/getAddMilkgiftAccount',{
												openid: this.fromOpenid, //此处是分享者的Id 需要改
												friendMobile: msg.data.sessions.mobile,
												friendOpenid: this.openid,
												nickname: res.data.nickname,
												headimgurl: res.data.headimgurl
											},(data) => {
												if(data.message === 'success') {
													//如果当前openid和url中分享的openid一致,则是分享者,否则是好友
													if(this.openid === this.fromOpenid) {
														this.setState({
															module: <GamePacket
																money={data.data.giftAccount.account / 1000}
																mobile={msg.data.sessions.mobile}
																clickButton={this.toShare.bind(this)}
															/>
														});
													}else{
														this.setState({
															friendOpenid: this.openid,
															module: <SharePacket
																money={data.data.giftAccount.account / 1000}
																mobile={msg.data.sessions.mobile}
															/>
														});
													}
													//获取后需重新刷新一遍列表
													fetchJson('/getAllgiftAccountLists',{
														openid: this.fromOpenid
													},(infoRefresh) => {
														if(infoRefresh.message === 'success') {
															this.setState({friendLists: infoRefresh.data});
														}
													});
												}else{
													Toast.info(data.message);
												}
											});
										}else{
											//如果点击者不是业主身份,需要先输入手机号码再调取获取赠金接口
											this.setState({
												friendOpenid: this.openid,
												module: <MobilePacket
													getMobile={this.toGetMobile.bind(this)}
													clickButton={this.toGetPacket.bind(this)}
												/>
											});
										}
									}else{
										Toast.info(msg.message);
									}
								});
							}
						}else{
							Toast.info(info.message);
						}
					});
				}else{
					Toast.info(res.message);
				}
			});
		}
	}
	componentDidMount() {
		const self = this;
		//微信分享接口
		fetchJson('/getUserWxInfoforenjoy', {openid: this.fromOpenid}, (res) => {
			let url = encodeURIComponent(location.href.split('#')[0]);
			let shareTitle = '分享给好友，瓜分万元大奖~!';
			//此处不能使用this.state.nickName,因为willmount里的异步获取
			let shareDesc = `来自${res.data.nickname}的请求，快来点击帮助他(她)`;
			//let shareDesc = '红包就要多多分享，戳进来领';
			let shareLink = `http://www.i-xiaoqu.com/union?openid=${this.fromOpenid}`; //此处B分享A的,仍旧是给A加赠金
			let shareImg = 'http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/share2.png';
			fetchJson('/getwxconfigforenjoy',{url:url},function(msg) {
				wx.config({
					debug: false,
					appId: msg.appid,
					timestamp: msg.time_stamp,
					nonceStr: msg.nonce_str,
					signature: msg.sign_pay,
					jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
				});
				wx.ready(() => {
					//分享朋友圈
					wx.onMenuShareTimeline({
						title: shareTitle, //分享标题
						link: shareLink, //分享链接
						imgUrl: shareImg, //分享图标
						success: function(res) {
							self.setState({isShare: false});
							Toast.info('分享成功!',1);
						},
						cancel: function(error) {
							self.setState({isShare: false});
							Toast.info('您已取消分享',1);
						}
					});
					//分享给好友
					wx.onMenuShareAppMessage({
						title: shareTitle, //分享标题
						desc: shareDesc, //分享描述
						link: shareLink, //分享链接
						imgUrl: shareImg, //分享图标
						success: function(res) {
							self.setState({isShare: false});
							Toast.info('分享成功!',1);
						},
						cancel: function(error) {
							self.setState({isShare: false});
							Toast.info('您已取消分享',1);
						}
					})
				});
			});
		});

	}
	//分享接口
	toShare() {
		this.setState({isShare: true});
	}
	//获取好友手机号
	toGetMobile(e) {
		this.setState({friendMobile: e});
	}
	//填写手机号后领红包
	toGetPacket() {
		//能进这个方法表明已经拉取过列表,且不在owner表里,且没领取过奖励
		if(matchMobile().test(this.state.friendMobile)) {
			fetchJson('/owner/registOwnerforenjoy',{
				openid: this.openid,
				mobile: this.state.friendMobile
			},(res) => {
				if(res.message === 'success') {
					fetchJson('/getAddMilkgiftAccount',{
						openid: this.fromOpenid,
						friendOpenid: this.state.friendOpenid,
						friendMobile: this.state.friendMobile,
						nickname: this.state.nickName,
						headimgurl: this.state.headImgUrl
					},(msg) => {
						if(msg.message === 'success') {
							this.setState({
								module: <SharePacket
									money={msg.data.giftAccount.account / 1000}
									mobile={this.state.friendMobile}
								/>
							});
							//获取后需重新刷新一遍列表
							fetchJson('/getAllgiftAccountLists',{
								openid: this.fromOpenid
							},(infoRefresh) => {
								if(infoRefresh.message === 'success') {
									this.setState({friendLists: infoRefresh.data});
								}
							});
						}else{
							Toast.info(msg.message);
						}
					});
				}else{
					Toast.info(res.message);
				}
			});
		}else{
			Toast.info('手机号码输入有误,请重新输入!',1.5);
		}
 	}
	//分享弹框
	fromSharePop(e) {
		this.setState({isShare: e});
	}
	render() {
		//当出现遮幕时禁止屏幕滚动
		if(this.state.isShare) {
			document.addEventListener('touchmove',function(e) {
				//阻止默认事件
				e.preventDefault();
			});
		}else{
			document.addEventListener('touchmove',function(e) {
				//恢复默认事件
				e.returnValue = true;
			});
		}
		return(
			<div className="union">
				<div className="top-img">
					<img
						src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/union-bg.png"
						alt="topImg"
					/>
					<div className="scale">
						<h6>活动时间</h6>
						<p>10.25-11.10</p>
					</div>
				</div>
				<img
					src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/red-packet-cap-bg.png"
			        alt="red-cap"
				/>
				<RedPacket module={this.state.module}/>
				<CutLine/>
				<div className="friendList">
					<h4>好友助力</h4>
					{this.state.friendLists.map((res,i) => {
						return(
							<FriendLabel
								key={i}
								headimgurl={res.headimgurl}
							    nickname={res.nickname}
							    time={res.time}
							    account={res.account / 1000}
							    brief={
							        (() => {
							            if(res.account / 1000 === 1 || res.account / 1000 === 2) {
							                return '分享出去，再得一个';
							            }else if(res.account / 1000 === 3 || res.account / 1000 === 4) {
								            return '红包就要多多益善';
								        }else{
								            return '此红包天上有地下无';
								        }}
							        )()
							    }
							/>
						)
					})}
				</div>
				<CutLine/>
				<div className="readMe">
					<h4>活动规则</h4>
					<p>1.红包仅限智取管家公众号使用；</p>
					<p>2.红包使用有效期以活动有效期为准，若未使用，过期失效；</p>
					<p>3.500元大礼包仅可领取一次，存入用户在智取管家公众号的代金券账户内；</p>
					<p>4.红包存入用户在智取管家公众号的馈赠金账户内，不可转赠与提现；</p>
					<p>5.参加活动用户存在违规行为（如恶意套现、机器作弊等), 本公司将根据自身合理判断取消用户获取红包的资格；</p>
					<p>6.本次活动最终解释权归杭州礼邻网络科技有限公司所有。</p>
				</div>
				<div className={this.state.isShare ? 'popShow block' : 'popShow hide'}>
					<SharePop
						popShow={this.fromSharePop.bind(this)}
					/>
				</div>
			</div>
		)
	}
}

export default Union;
