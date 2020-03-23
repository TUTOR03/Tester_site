module.exports = {
	module:{
		rules:[
			{
				test: /\.js$/,
				exclude:/node_modules/,
				use: {
          			loader: "babel-loader"
        		},
			},
			{
				test:/\.(jpg|png|svg|gif)$/,
				use:['url-loader'],			
			},
			{
				test: /\.css$/,
        		use: ['style-loader', 'css-loader'],
			}
		]
	}
}