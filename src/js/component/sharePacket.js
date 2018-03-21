/**
 * Created by yulingjie on 17/10/12.
 */
import React,{Component} from 'react'
import {Link} from 'react-router-dom'

//被分享用户领取礼包
class SharePacket extends Component{
	toHomePage() {
		location.href = '/wxReactHome';
	}
	render() {
		return(
			<div className="red-packet-content">
				{/*被分享用户领取的礼包*/}
				<p className="title-B">恭喜您获得500元大礼包</p>
				<div className="card">
					<img
						src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/red-packet.png"
						alt="topImg"
					/>
					<div className="card-left"><p style={{fontSize: '.18rem'}}>价值500</p></div>
					<div className="card-right"><p>现代牧业大礼包</p></div>
				</div>
				{/*给分享用户赚取的红包*/}
				<p className="title-B">您已助力好友获得{this.props.money}元红包</p>
				<div className="card">
					<img
						src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/red-packet.png"
						alt="topImg"
					/>
					<div className="card-left"><p>¥ {this.props.money}</p></div>
					<div className="card-right"><p>现代牧业红包</p></div>
				</div>
				<div className="mobile">
					<p>红包已放入帐号: {this.props.mobile}</p>
				</div>
				<div className="red-packet-btn" onClick={this.toHomePage.bind(this)}>
					<p>立即使用</p>
				</div>
			</div>
		)
	}
}

export default SharePacket;
