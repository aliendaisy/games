/**
 * Created by yulingjie on 17/9/28.
 */
import React,{Component} from 'react'
import {fetchJson} from './fetch'
import {prizeList} from './functional'
import {Toast} from 'antd-mobile/lib'

//周围的中奖格子
class Grid extends Component{
	render() {
		return(
			<div
				className={this.props.id == this.props.selectId ? 'gridSelect' : 'grid'}
				id={this.props.id}
			>
				<img src={this.props.source} alt="award"/>
				<p>
					{this.props.name}
				</p>
			</div>
		)
	}
}

//中间的按钮格子
class CenterGrid extends Component{
	render() {
		return(
			<div className={this.props.className} onClick={this.props.clickToAward}>
				<h4>{this.props.title}</h4>
				<p>{this.props.subTitle}</p>
			</div>
		)
	}
}

class NineGrid extends Component{
	constructor(props) {
		super(props);
		this.state = {
			className: 'centerGrid', //中间按钮变换,控制能否点击
			isDrawn: false, //是否开始抽奖动画
			showAward: false, //是否显示中奖弹框
			selectAward: 1, //默认选择的奖品编号
			i: 0, //计次,变动次数
		};
	}
	getAward() {
		//判断是否可点击
		if(this.state.className === 'centerGrid') {
			let openid = this.props.openid;
			if(openid) {
				//根据openid获取用户是否是注册业主,业主才能抽奖
				fetchJson('/getOwnerByOpenid',{openid: openid},(msg) => {
					if(msg.message === 'success' && msg.data.docs && msg.data.docs.role === '业主') {
						let mobile = msg.data.sessions.mobile;
						localStorage.setItem('ownerid', msg.data.sessions.ownerid);
						localStorage.setItem('mobile', msg.data.sessions.mobile);
						fetchJson('/lotteryDraw',{mobile: mobile},(res) => {
							if(res.message === 'success') {
								prizeList().map((data) => {
									if(data.name === res.data) {
										this.getApi = parseInt(data.value);
									}
								});
								//this.getApi = parseInt(Math.random() * (8 - 1 + 1) + 1); //此处是从接口获得的数据,此行测试用
								let getId = document.getElementById(parseInt(this.getApi));
								let getSource = getId.querySelector('img').getAttribute('src');
								let getName = getId.querySelector('p').innerHTML;
								let ifDrawn = res.data === '未中奖' ? false : true;

								//若getApi大于4,直接第三圈就结束,否则再转一圈才结束
								this.plus = this.getApi > 4 ? this.getApi - 4 : this.getApi + 4;
								//点击时重置
								this.setState({
									className: 'centerGridClick',
									isDrawn: true,
									showAward: false,
									selectAward: 1,
									i: 0
								});
								//只在可以抽奖时有遮幕,防止在抽奖时点击其他按钮
								this.props.isAbleToClick(this.state.className);
								//首先快速转动
								this.quick = setInterval(() => {
									this.setState({
										selectAward: this.state.selectAward % 8 + 1, //取余数
										i: this.state.i + 1
									});
									//判断i转动次数
									if(this.state.i >= 16 + this.plus) {
										clearInterval(this.quick); //清除quick计时器
										//清空i
										this.setState({
											i: 0
										});
										//创建slow计时器
										this.slow = setInterval(() => {
											this.setState({
												selectAward: this.state.selectAward % 8 + 1,
												i: this.state.i + 1
											});
											//判断执行次数
											if(this.state.i >= 3) {
												clearInterval(this.slow);
												this.setState({
													className: 'centerGrid',
													isDrawn: false,
													showAward: true
												});
												this.props.popShow(this.state.className,this.state.showAward,getSource,getName,ifDrawn);
											}
										},300);
									}
								},100);
							}else{
								Toast.info('您已没有机会再次抽取!', 2);
								this.setState({className: 'centerGridClick'});
							}
						});
					}else{
						this.props.isSignUpShown(true);
					}
				});
			}
			return;
		}
	}
	getData(source,name) {
		console.log(source,name)
	}
	render() {
		return(
			<div className="nine-grid">
				<div className="grid-line">
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-dyson.png"
						name="戴森吸尘器一台"
						selectId={this.state.selectAward}
					    id="1"
					/>
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-liquan.png"
						name="大闸蟹礼券"
						selectId={this.state.selectAward}
						id="2"
					/>
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-100.png"
						name="牛奶代金券100元"
						selectId={this.state.selectAward}
						id="3"
					/>
				</div>
				<div className="grid-line">
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-200.png"
						name="200元话费充值"
						selectId={this.state.selectAward}
						id="8"
					/>
					<CenterGrid
						className={this.state.className}
						title="立即抽奖"
					    subTitle="(免费抽一次)"
					    clickToAward={this.getAward.bind(this)}
					/>
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-10.png"
						name="牛奶代金券10元"
						selectId={this.state.selectAward}
						id="4"
					/>
				</div>
				<div className="grid-line">
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-50.png"
						name="牛奶代金券50元"
						selectId={this.state.selectAward}
						id="7"
					/>
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-0.png"
						name="谢谢惠顾"
						selectId={this.state.selectAward}
						id="6"
					/>
					<Grid
						source="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/pic-20.png"
						name="牛奶代金券20元"
						selectId={this.state.selectAward}
						id="5"
					/>
				</div>
			</div>
		)
	}
}

export default NineGrid;
