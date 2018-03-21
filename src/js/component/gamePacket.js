/**
 * Created by yulingjie on 17/10/12.
 */
import React,{Component} from 'react'

//抽奖用户领取红包
class GamePacket extends Component{
	render() {
		return(
			<div className="red-packet-content">
				<p className="title-A">恭喜获得{this.props.money}元红包</p>
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
				<div className="red-packet-btn" onClick={this.props.clickButton}>
					<p>请好友助力</p>
				</div>
			</div>
		)
	}
}

export default GamePacket;
