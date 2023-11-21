import path from "path";
import webpack, {Configuration} from "webpack";
import * as webpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from "html-webpack-plugin";
//import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";

const webpackConfig = (env): Configuration => ({
    entry: "./src/index.tsx",
    ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        //TODO waiting on https://github.com/dividab/tsconfig-paths-webpack-plugin/issues/61
        //@ts-ignore
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        path: path.join(__dirname, "/dist"),
        filename: "build.js",
        publicPath: "/odinbook",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    transpileOnly: true
                },
                exclude: /dist/
            },
	        {
		        test: /\.css$/i,
		        use: ["style-loader", "css-loader", "postcss-loader"],
	        },
        ]
    },
    devServer: {
        historyApiFallback: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        new webpack.DefinePlugin({
            "process.env.PRODUCTION": env.production || !env.development,
            "process.env.NAME": JSON.stringify(require("./package.json").name),
            "process.env.VERSION": JSON.stringify(require("./package.json").version)
        }),
    ]
});


export default webpackConfig;
