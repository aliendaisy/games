/**
 * Created by yulingjie on 17/10/12.
 */
import React,{Component} from 'react'

//被分享用户输入手机号
class MobilePacket extends Component{
	handleChg() {
		this.props.getMobile(this.refs.getMobileInput.value);
	}
	render() {
		return(
			<div className="red-packet-content">
				<div className="title">
					<p className="title-C">恭喜您~帮助好友获得红包</p>
					<p className="title-C">输入手机号即可领取红包</p>
				</div>
				<input
					type="text"
					placeholder="请输入您的手机号码"
					pattern="[0-9]*"
				    ref="getMobileInput"
				    onChange={this.handleChg.bind(this)}
				/>
				<div className="red-packet-btn" onClick={this.props.clickButton}>
					<p>拆红包</p>
				</div>
			</div>
		)
	}
}

export default MobilePacket;
