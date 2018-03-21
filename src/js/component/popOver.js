/**
 * Created by yulingjie on 17/9/30.
 */
import React,{Component} from 'react'
import {Link} from 'react-router-dom'

//弹框内容
class Overlay extends Component{
	toHomePage() {
		location.href = '/union';
	}
	render() {
		return(
			<div className="overlay">
				<div className="pop-close" onClick={this.props.close}>
					<span className="iconfont icon-close"></span>
				</div>
				<div className="award-big">
					<img src={this.props.popImg} alt="Award"/>
				</div>
				<p>{this.props.drawn ? `恭喜您获得${this.props.popName}!` : '很遗憾,您并未中奖!'}</p>
				<p className={this.props.drawn ? 'block' : 'hide'}>您可在'我的奖品'中查看奖品</p>
				<div
					className={this.props.drawn ? "block pop-btn" : "hide"}
				    onClick={this.toHomePage.bind(this)}
				>
					继续抽红包
				</div>
			</div>
		)
	}
}

//遮布
export class Mask extends Component{
	render() {
		return(
			<div className="mask" onClick={this.props.onClick}></div>
		)
	}
}

//获奖弹框
export class PopOver extends Component{
	handleClick() {
		this.props.popShow(false);
	}
	render() {
		return(
			<div className="popOver">
				<Overlay
					popImg={this.props.popImg}
				    popName={this.props.popName}
					drawn={this.props.drawn}
				    close={this.handleClick.bind(this)}
				/>
				<Mask onClick={this.handleClick.bind(this)}/>
			</div>
		)
	}
}

export default PopOver;
