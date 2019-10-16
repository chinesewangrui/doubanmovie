// pages/charts/charts.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMovies:[],
        hotMovies:[],
    },
    //封装函数,获取数组从大到小排列
    objsort:function(arr,propName){
        arr.sort((a,b)=>{
            return b[propName] - a[propName];
        })
    },
    //调用云函数获取TOP250
    loadTop:function(){
        wx.cloud.callFunction({
            name:'gettop250',
            data:{
               start:0,
               count:30 
            }
        }).then(res=>{
            var result=JSON.parse(res.result);
            var movies=result.subjects;
            movies.map((elem)=>{
                elem.average=elem.rating.average;
                return elem
            })
            this.objsort(movies,"average");
            movies=movies.slice(0,10)
            console.log(movies)
            this.setData({
                topMovies:movies
            })
        }).catch(err=>{
            console.log(err)
        })
    },
    //调用云函数获取热映电影
    loadHot:function(){
        wx.cloud.callFunction({
            name:'gethotmovies',
            data:{
               start:0,
               count:30 
            }
        }).then(res=>{
            var result=JSON.parse(res.result);
            var movies=result.subjects;
            movies.map((elem)=>{
                elem.average=elem.rating.average;
                return elem
            })
            this.objsort(movies,"average");
            movies=movies.slice(0,10)
            console.log(movies)
            this.setData({
                hotMovies:movies
            })
        }).catch(err=>{
            console.log(err)
        })
    },
    //前往详情页
    goDetail:function(e){
        var id=e.target.dataset.id;
        wx.navigateTo({
            url: `/pages/moviedetail/moviedetail?id=${id}`,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadTop();
        this.loadHot()
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})