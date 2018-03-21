import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import Game from './js/component/game'
import PrizeList from './js/component/prizeList'
import Rule from './js/component/rule'
import Union from './js/component/union'
import './css/index.css';
import 'antd-mobile/lib/toast/style/index.css' //toast的样式需要重新加载
import 'antd-mobile/lib/activity-indicator/style/index.css' //activity-indicator的样式需要重新加载

import {BrowserRouter,Route,Switch} from 'react-router-dom';

export class App extends Component{
	render() {
		return(
			<BrowserRouter>
				<div>
					<Route path="/milkLottery" exact component={Game}/>
					<Route path="/milkLottery/prizeList" render={() => <PrizeList/>}/>
					<Route path="/milkLottery/rule" render={() => <Rule/>}/>
					<Route path="/union" component={Union}/>
				</div>
			</BrowserRouter>
		)
	}
}

ReactDOM.render(<App/>, document.getElementById('root'));
