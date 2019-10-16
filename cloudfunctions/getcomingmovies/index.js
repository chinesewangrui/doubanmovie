// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入request-promise
const rp = require("request-promise");
// 云函数入口函数
// 创建主函数
exports.main = async (event, context) => {
    // 创建url
    var url = `https://api.douban.com/v2/movie/coming_soon`;
    url += `?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`;
    // 使用reques-promise发送请求
    return rp(url)
        .then(res => {
            return res;
        })
        .catch(err => console.log(err))
}