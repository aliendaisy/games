/**
 * Created by yulingjie on 17/9/22.
 */
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import NineGrid from './nine-grid'
import PopOver from './popOver'
import SignUp from './signUp'
import {fetchJson,getWxCodeUrl} from './fetch'
import {prizeList} from './functional'
import {Carousel,Toast} from 'antd-mobile/lib'
import URI from 'urijs'

//灯管闪烁效果
class Light extends Component{
	render() {
		return(
			<ul className={"light-board " + this.props.indexClass}>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
				<li className="light"><div></div></li>
			</ul>
		)
	}
}

class Game extends Component{
	constructor(props) {
		super(props);
		this.state = {
			popShow: false,
			isSignUp: true,
			popImg: '',
			popName: '',
			awardList: [],
			showTransMask: false //透明遮幕是为了防止点击抽奖还没结束,用户点击其他按钮
		}
	}
	fromNineGrid(a,e,source,name,drawn) {
		console.log('子组件传值',a,e,source,name,drawn)
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.setState({
				showTransMask: a === 'centerGridClick' ? true : false,
				popShow: e,
				popImg: source,
				popName: name,
				drawn: drawn
			});
		},150);
	}
	//通过nine-grid点击时调用的接口改变是否注册的state
	isSignUpShown(e) {
		e = !e;
		this.setState({
			isSignUp: e
		});
	}
	fromPopOver(e) {
		this.setState({
			popShow: e
		});
	}
	fromSignUp(e) {
		e = !e;
		this.setState({
			isSignUp: e
		});
	}
	AbleToClick(e) {
		this.setState({
			showTransMask: e === 'centerGridClick' ? true : false
		});
	}
	componentWillMount() {
		//本地存储openid,微信授权
		const openid = localStorage.getItem('openid');
		//const openid = 'oCWLqtzAU1sNABjiBcz6TSnFjhiM';
		const createAt = localStorage.getItem('createAt');
		const expire = createAt ? new Date().getTime() - createAt : 0;
		this.openid = openid; //用于向子组件传值
		//时效期7天过期,或没有openid,或没有createAt则重新获取code
		if(!openid || !createAt || expire > 7 * 24 * 60 * 60 * 1000) {
			const uri = new URI(document.location.href);
			const query = uri.query(true);
			const {code} = query;
			if(code) {
				fetchJson('/getAccessCode',{code: code},(msg) => {
					if(msg.message === 'success') {
						//第一次进来时openid为空,需要在setItem时赋值
						this.openid = msg.data;
						localStorage.setItem('openid', msg.data);
						localStorage.setItem('createAt', new Date().getTime());
						//此处是用户第一次进来时需要实时调用
						//获取所有的获奖名单,每隔10秒刷新,先执行一次(若写进函数,则didmount后此处不执行)
						fetchJson('/getwinprize',{},(msg) => {
							if(msg.message === 'success') {
								let drawnList = [];
								msg.data.map((res) => {
									if(res.prize !== '未中奖') {
										prizeList().map((data) => {
											if(res.prize === data.name) {
												drawnList.push(
													`恭喜${res.mobile.substring(0,3)}****${res.mobile.substring(7,11)} 抽中${data.detail}`
												);
											}
										});
									}
								});
								this.setState({awardList: drawnList});
							}
						});
					}else{
						Toast.info(msg.message, 1.5);
					}
				});
			}else{
				document.location = getWxCodeUrl(document.location.href);
			}
		}
		//获取所有的获奖名单,每隔10秒刷新,先执行一次(若写进函数,则didmount后此处不执行)
		fetchJson('/getwinprize',{},(msg) => {
			if(msg.message === 'success') {
				let drawnList = [];
				msg.data.map((res) => {
					if(res.prize !== '未中奖') {
						prizeList().map((data) => {
							if(res.prize === data.name) {
								drawnList.push(
									`恭喜${res.mobile.substring(0,3)}****${res.mobile.substring(7,11)} 抽中${data.detail}`
								);
							}
						});
					}
				});
				this.setState({awardList: drawnList});
			}
		});
		this.timer = setInterval(() => {
			fetchJson('/getwinprize',{},(msg) => {
				if(msg.message === 'success') {
					let drawnList = [];
					msg.data.map((res) => {
						if(res.prize !== '未中奖') {
							prizeList().map((data) => {
								if(res.prize === data.name) {
									drawnList.push(
										`恭喜${res.mobile.substring(0,3)}****${res.mobile.substring(7,11)} 抽中${data.detail}`
									);
								}
							});
						}
					});
					this.setState({awardList: drawnList});
				}
			});
		},10000);
	}
	componentDidMount() {
		//微信分享接口
		let url = encodeURIComponent(location.href.split('#')[0]);
		let shareTitle = '现代牧业惊喜豪礼,5000元大奖等你来拿!';
		let shareDesc = '点击领取免费好礼和戴森吸尘器!';
		let shareLink = 'http://www.i-xiaoqu.com/milkLottery'; //此处B分享A的,仍旧是给A加赠金
		let shareImg = 'http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/share1.png';
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
						Toast.info('分享成功!',1);
					},
					cancel: function(error) {
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
						Toast.info('分享成功!',1);
					},
					cancel: function(error) {
						Toast.info('您已取消分享',1);
					}
				})
			});
		});
	}
	//在组件离开时清除定时器,避免在别的页面刷新接口,占据内存
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	//跳转页面需要location.href
	toUnion() {
		//当领过奖后再跳转
		fetchJson('/getOwnerGiftByOpenid',{openid: this.openid},(msg) => {
			if(msg.message === 'success') {
				if(JSON.stringify(msg.data) !== '{}') {
					location.href = '/union';
				}else{
					Toast.info('请先抽奖在抽取红包',1.5);
				}
			}
		});
	}
	render() {
		//当出现遮幕时禁止屏幕滚动
		if(this.state.popShow || !this.state.isSignUp) {
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
			<div className="game">
				<div className={this.state.showTransMask ? 'transparent-mask' : 'hide'}></div>
				<div className="top-img">
					<img
						src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/game-header.png"
				        alt="topImg"
					/>
				</div>
				<div className="television">
					<Link to="/milkLottery/rule">
						<div className="top-rule">活动规则</div>
					</Link>
					<div className="television-header">
						<div>
							<p>赢取免费好礼和戴森吸尘器</p>
						</div>
						<div>&nbsp;</div>
					</div>
					<div className="television-body">
						<Light indexClass="light-board-top"/>
						<Light indexClass="light-board-right"/>
						<Light indexClass="light-board-bottom"/>
						<Light indexClass="light-board-left"/>
						<div className="nine-grid-box">
							<NineGrid
								popShow={this.fromNineGrid.bind(this)}
								isSignUpShown={this.isSignUpShown.bind(this)}
								isAbleToClick={this.AbleToClick.bind(this)}
								openid={this.openid}
							/>
						</div>
					</div>
					<div className="television-footer">
						<div className="oneFoot">
							<div></div>
						</div>
						<div className="oneFoot">
							<div></div>
						</div>
					</div>
				</div>
				<div className="bottom-shadow">&nbsp;</div>
				<div className="btn-area">
					<a onClick={this.toUnion.bind(this)}>
						<div className="btn-center">
							<p>请好友助力赢取最高500元全场红包</p>
						</div>
					</a>
				</div>
				<div className="award-area">
					<Link to="/milkLottery/prizeList">
						<div className="top-award">
							<p>我的奖品</p>
						</div>
					</Link>
					<div className="btn-award">
						<p>获奖名单</p>
					</div>
					<Carousel className="award-list"
					          vertical
					          dots={false}
					          dragging={false}
					          swiping={false}
					          autoplay
					          infinite
					          speed={1000}
					          //autoplayInterval={1000}
					          resetAutoplay={false}
					>
						{this.state.awardList.map(type => (
							<div className="v-item" key={type}>{type}</div>
						))}
					</Carousel>
					<div className="info-bottom">
						<p>*代金券请关注“智取管家”公众号使用，客服热线 <a href="tel:400-049-4478">400-049-4478</a></p>
					</div>
				</div>
				<div className={this.state.isSignUp ? 'popShow hide' : 'popShow block'}>
					<SignUp
						isSignUpShown={this.fromSignUp.bind(this)}
					    openid={this.openid}
					/>
				</div>
				<div className={this.state.popShow ? 'popShow block' : 'popShow hide'}>
					<PopOver
						popShow={this.fromPopOver.bind(this)}
					    popImg={this.state.popImg}
					    popName={this.state.popName}
					    drawn={this.state.drawn}
					/>
				</div>
			</div>
		)
	}
}

export default Game;
