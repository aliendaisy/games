/**
 * Created by yulingjie on 17/10/13.
 */
import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

class Header extends Component{
	//返回按钮
	goBack() {
		this.context.router.history.goBack();
	}
	render() {
		return(
			<div className="navHeader">
				<img
					src="http://wxxdmy-game.oss-cn-hangzhou.aliyuncs.com/image/back.png"
					alt="back"
				    onClick={this.goBack.bind(this)}
				/>
				<p>{this.props.title}</p>
			</div>
		)
	}
}

Header.contextTypes = {
	router: PropTypes.object
};

export default Header;
