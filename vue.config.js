// const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
	lintOnSave: false,
	publicPath: './',
	outputDir: 'dist',
	assetsDir: './admin/',
	productionSourceMap: false,
	devServer: {
		open: false,
		host: 'localhost',
		port: 8008,
		https: false,
		proxy: {
			'/cgi-bin': {
				target: 'http://192.168.0.1',
				ws: true,
				changOrigin: true,
				pathRewrite: {
					'^/cgi-bin/http.cgi': '/cgi-bin/http.cgi'
				}
			}
		}
	},
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {
						// 'primary-color': '#16cdab',// 全局主色
						// 'link-color': '#1DA57A',// 链接色
						'form-item-margin-bottom': '12px',//表单上下间距
						'font-size-base': '14px', // 主字号
						'border-radius-base': '4px', // 组件/浮层圆角
						'btn-border-radius-base': '20px',//按钮圆角
					},
					javascriptEnabled: true,
				},
			},
		},
	},
	// configureWebpack: config => {//打包时对js/css文件进行压缩
	// 	if (process.env.NODE_ENV === 'production') {//生产环境
	// 		config.plugins.push(
	// 			new CompressionPlugin({
	// 				filename: '[path].gz[query]',
	// 				algorithm: 'gzip',//压缩算法
	// 				test: /\.js$|\.css$|\.html$/,//匹配文件
	// 				threshold: 10240,//压缩超过此大小的文件,以字节为单位
	// 				minRatio: 0.8,//压缩比
	// 			})
	// 		)
	// 	}
	// }
};
