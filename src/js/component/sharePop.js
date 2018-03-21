/**
 * Created by yulingjie on 17/10/19.
 */
import React,{Component} from 'react'
import {Mask} from './popOver'

class SharePop extends Component{
	handleClick() {
		this.props.popShow(false);
	}
	render() {
		return(
			<div className="sharePop">
				<div className="top-info">
					<p>点击右上角分享给朋友或朋友圈</p>
					<img
						src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/guideLine.png"
				        alt="guideLine"
					/>
				</div>
				<Mask onClick={this.handleClick.bind(this)}/>
			</div>
		)
	}
}

export default SharePop;
