// pages/home/home.js
const db = wx.cloud.database()
const app= getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pno:0,
        newMovies:[],//即将上映电影
        hotMovies:[],// 热门电影
        allMovies:[]//电影库
    },
    // 功能:调用云函数完成数据加载
    //加载首页即将上映电影
    loadNew:function(){
        //调用云函数
        wx.cloud.callFunction({
            name:"getcomingmovies",
            data:{
                start:0,
                count:6
            }
        })
        .then(res=>{
            //云函数返回结果,输出即将上映电影列表
            var result=JSON.parse(res.result);
            var arr = result.subjects;
            this.setData({
                newMovies:arr
            })
        })
        .catch(err=>console.log(err))
    },
    //加载首页热映电影
    loadHot:function(){
        //调用云函数
        wx.cloud.callFunction({
            name: "gethotmovies",
            data: {
                start: 0,
                count: 6
            }
        })
        .then(res => {
            //云函数返回结果,输出热门电影列表
            var result = JSON.parse(res.result);
            var arr = result.subjects;
            this.setData({
                hotMovies: arr
            })
        })
        .catch(err => console.log(err))
    },
    //加载首页TOP250电影列表
    loadAll:function(){
        // 下一页
        var pno=this.data.pno+1;
        this.setData({pno});
        var start=(pno-1)*6;
        //调用云函数
        wx.cloud.callFunction({
            name:'gettop250',
            data:{
                start,
                count:6
            }
        }).then(res=>{
            var result=JSON.parse(res.result);
            var  allMovies=this.data.allMovies.concat(result.subjects);
            this.setData({allMovies})
        }).catch(err=>{
            console.log(err)
        })
    },
    //跳转到详情页
    goDetail:function(e){
        var id = e.target.dataset.id;
        wx.navigateTo({
            url: `/pages/moviedetail/moviedetail?id=${id}`,
        })
    },
    //t跳转到电影列表
    goList:function(e){
        var name=e.target.dataset.name;
        getApp().globalData.functionId=name;
        wx.reLaunch({
            url: `/pages/movies/movies`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadNew();
        this.loadHot();
        this.loadAll()
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadAll()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})