/**
 * Created by yulingjie on 17/10/12.
 */
import React,{Component} from 'react'
import {fetchJson} from './fetch'
import {prizeList} from './functional'
import Header from './header'
import moment from 'moment'
import {ActivityIndicator} from 'antd-mobile/lib'

class HasPrize extends Component{
	render() {
		return(
			<table>
				<thead>
					<tr>
						<th width="15%">奖项</th>
						<th width="30%">奖品名称</th>
						<th width="25%">获奖号码</th>
						<th width="30%">获奖时间</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{this.props.prize}</td>
						<td>{this.props.prizeName}</td>
						<td>{this.props.mobile}</td>
						<td>{this.props.time}</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

class NoPrize extends Component{
	render() {
		return(
			<div className="noPrize">
				<img src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/noPrize.png" alt="noPrize"/>
				<p>很抱歉,您并未获得任何奖品!</p>
			</div>
		)
	}
}
class PrizeList extends Component{
	constructor(props) {
		super(props);
		this.state = {
			showModule: <ActivityIndicator/>
		}
	}
	componentDidMount() {
		let openid = localStorage.getItem('openid');
		//let openid = 'oCWLqtzAU1sNABjiBcz6TSnFjhiM';
		fetchJson('/getOwnerGiftByOpenid',{openid: openid},(msg) => {
			if(msg.message === 'success') {
				console.log(msg.data)
				if(JSON.stringify(msg.data) === '{}' || msg.data.prize === '未中奖') {
					this.setState({
						showModule: <NoPrize/>
					})
				}else{
					this.setState({
						showModule: <HasPrize
										prize={msg.data.prize}
										prizeName={
											prizeList().map((data) => {
												if(data.name === msg.data.prize) {
													return data.detail;
												}
											})
										}
						                mobile={msg.data.mobile}
						                time={moment(msg.data.time).format('YYYY-MM-DD HH:mm:ss')}
									/>
					});
				}
			}
		});
	}
	render() {
		return(
			<div className="prizeList">
				<Header
					title="我的奖品"
				/>
				<div className="prize-board">
					{this.state.showModule}
				</div>
			</div>
		)
	}
}

export default PrizeList;
