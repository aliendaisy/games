/**
 * Created by yulingjie on 17/10/11.
 */
const webpack = require('webpack');
const path = require('path');
const json = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	//devtool: "eval-source-map", //eval-source-map利于调试,上线时换成source-map
	//devtool: "inline-sourcemap",

	entry: {
		index: __dirname + "/src/index.js",
		//vendor: ['antd-mobile/lib','react','react-dom','moment','react-router','react-router-dom','urijs'],
	}, //唯一入口文件,--dirname指向当前执行脚本所在的目录
	output: {
		path: __dirname + "/public", //打包后的文件存放的地方
		//filename: "bundle_test6.js" //打包后输出的文件名
		//filename: "[name].js", //打包后输出的文件名
		filename: "bundle_gm0005.js", //打包后输出的文件名
	},

	devServer: {
		contentBase: "./public", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: true, //实时刷新
		//hot: true
	},

	module: {
		rules: [
			{
				//对jsx文件解析,配置babel
				test: /(\.jsx|\.js)$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"es2015","react"
						],
						//热加载配置
						//env: {
						//	development: {
						//		plugins: [
						//			["react-transform", {
						//				transforms: [{
						//					transform: "react-transform-hmr",
						//					imports: ["react"],
						//					locals: ["module"]
						//				}]
						//			}]
						//		]
						//	}
						//}
					}
				},
				exclude: /node_modules/
			},{
				//对css文件解析
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},{
						loader: "css-loader"
					}
				]
			},{
				//图片字体解析
				test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
				use: {
					loader: 'url-loader?limit=8192&name=[name]-[hash].[ext]'
				}
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin(),
		//new webpack.HotModuleReplacementPlugin(), //热加载插件
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
			},
			compress: {
				warnings: false
			}
		}),

		//new webpack.optimize.CommonsChunkPlugin({
		//	name: 'vendor',
		//	filename: 'common.js',
		//	minChunks: Infinity,
		//}),
	]
};
