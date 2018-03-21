/**
 * Created by yulingjie on 17/10/10.
 */
import 'whatwg-fetch'
import URI from 'urijs'

export function fetchJson(url,params,cb){
	let myHeaders = new Headers({"Content-Type": "application/json"});
	let headerUrl = 'http://www.i-xiaoqu.com/wxAccount';
	let allUrl = headerUrl + url;
	fetch(allUrl,{
		method: 'post',
		headers: myHeaders,
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify({params})
	}).then(res => {
		res.json().then(function(data){
			return cb(data);
		});
	}).catch(err => {
		console.log(err);
	});
}

//wxa852b4d1234384dc 智取管家
//wx578e32724b797cb3 礼邻网络
//用户授权
export function getWxCodeUrl(redirectURL) {
	return new URI("https://open.weixin.qq.com/connect/oauth2/authorize")
		.addQuery("appid", "wxa852b4d1234384dc")
		.addQuery("redirect_uri", redirectURL)
		.addQuery("response_type", "code")
		.addQuery("scope", "snsapi_userinfo")
		.hash("wechat_redirect")
		.toString();
}

