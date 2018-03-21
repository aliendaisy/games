/**
 * Created by yulingjie on 17/10/4.
 */
import React,{Component} from 'react'

//红包
class RedPacket extends Component{
	render() {
		return(
			<div className="red-packet">
				<div className="red-packet-cap"></div>
				<div className="red-packet-header">
					<div className="red-packet-ear">
						<div></div>
					</div>
					<div className="red-packet-ear">
						<div className="ear-right">
							<div className="ear-mask"></div>
						</div>
					</div>
				</div>
				<div className="red-packet-body">
					<div className="red-packet-mask">
						{this.props.module}
					</div>
				</div>
			</div>
		)
	}
}

export default RedPacket;
