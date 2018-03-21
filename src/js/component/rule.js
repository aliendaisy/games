/**
 * Created by yulingjie on 17/10/13.
 */
import React,{Component} from 'react'
import Header from './header'

class Rule extends Component{
	render() {
		return(
			<div className="rule">
				<Header
					title="活动规则"
				/>
				<div className="rule-detail">
					<h4>活动细则</h4>
					<p>1、用户须在2017/10/25~2017/11/10参与抽奖活动，截止日期以后不能参加；</p>
					<p>2、发送的姓名和联系方式必须为真实信息，如有虚假信息将取消中奖资格；</p>
					<p>3、抽奖活动结束后，中奖用户保持电话畅通，工作人员会在5个工作日内主动联系中奖用户，如电话未接通，则视为自动放弃；</p>
					<p>4、联系中奖用户后，10个工作日内工作人员上门到用户家中发放奖品。</p>
					<p>5、本活动最终解释权为杭州礼邻网络科技有限公司所有。</p>
				</div>
			</div>
		)
	}
}

export default Rule;
