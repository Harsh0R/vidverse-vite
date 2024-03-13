module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BICONOMY_SDK_DEBUG': JSON.stringify(process.env.BICONOMY_SDK_DEBUG),
            'process.env.REACT_APP_BICONOMY_SDK_DEBUG': JSON.stringify(process.env.REACT_APP_BICONOMY_SDK_DEBUG),
        }),
    ],
}