// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//引入request-promise库
const rp = require("request-promise")
// 云函数入口函数
exports.main = async (event, context) => {
    var url = `http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`
    return rp(url).then(res => {
        return res;
    }).catch(err => console.log(err))
}