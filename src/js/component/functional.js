/**
 * Created by yulingjie on 17/10/12.
 */

//数组匹配
export function prizeList() {
	let prizes = [
		{name: '一等奖',value: '1',detail: '戴森吸尘器一台'},
		{name: '二等奖',value: '2',detail: '大闸蟹礼券'},
		{name: '三等奖',value: '8',detail: '200元话费充值'},
		{name: '四等奖',value: '3',detail: '牛奶代金券100元'},
		{name: '五等奖',value: '7',detail: '牛奶代金券50元'},
		{name: '六等奖',value: '5',detail: '牛奶代金券20元'},
		{name: '七等奖',value: '4',detail: '牛奶代金券10元'},
		{name: '未中奖',value: '6',detail: '谢谢惠顾'}
	];
	return prizes;
}

//验证手机号
export function matchMobile() {
	let regex = /^((\+)?86|((\+)?86)?)0?1[3578]\d{9}$/;//手机号码正则表达式
	return regex;
}

//取url中的参数
export function getQueryString(name) {
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	let r = window.location.search.substr(1).match(reg); //获取url中"?"字符后的字符串并正则匹配
	var context = "";
	if(r != null) context = r[2]; //通过console,可以看到r[2]是openid的值
	return context;
}
