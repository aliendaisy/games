/**
 * Created by yulingjie on 17/10/18.
 */
import React,{Component} from 'react'
import moment from 'moment'

//助力列表一栏
class FriendLabel extends Component{
	render() {
		return(
			<div className="friendLabel">
				<img src={this.props.headimgurl} alt="img"/>
				<p className="basic-info">
					{this.props.nickname}
					<span className="time">{moment(this.props.time).format('MM.DD HH:mm:ss')}</span>
					<span className="gift-account">{this.props.account}元</span>
				</p>
				<p className="gift-brief">{this.props.brief}</p>
			</div>
		)
	}
}

export default FriendLabel;
