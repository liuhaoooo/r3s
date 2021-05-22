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
				target: 'http://192.168.10.1',
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
};
