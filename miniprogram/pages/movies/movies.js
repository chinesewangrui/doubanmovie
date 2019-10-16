// pages/movies/movies.js
const app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:'电影TOP250',
        pno:0,
        name: 'gettop250',//保存需要调用的云函数名称
        movies:[] //电影列表
    },
    // 加载电影列表
    loadMore:function(){
        var name=this.data.name;
        console.log(name)
        var pno=this.data.pno+1;
        this.setData({pno});
        var start = (pno-1)*4;
        //显示数据加载提示框
        wx.showLoading({
            title: '正在拼命加载中',
        })
        wx.cloud.callFunction({
            name,
            data:{
                start,
                count:4
            }
        }).then(res=>{
            var result=JSON.parse(res.result);
            var movies = result.subjects;
            movies=this.data.movies.concat(movies)
            this.setData({
                movies
            })
            console.log(this.data.movies)
            wx.hideLoading()
        }).catch(err=>{console.log(err)})
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var name = app.globalData.functionId;
        var title=this.data.title;
        if (name =='getcomingmovies'){
            title='即将上映'
        } else if (name =='gethotmovies'){
            title='热映电影'
        }else{
            title='TOP电影'
        }
        this.setData({
            name,title
        })
        this.loadMore()
    },
    // 跳转到详情页
    goDetails:function(e){
        var id=e.target.dataset.id;
        wx.navigateTo({
            url: `/pages/moviedetail/moviedetail?id=${id}`,
        })
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
        var name = app.globalData.functionId;
        var oldname=this.data.name;
        if(name != oldname){
            var title = this.data.title;
            if (name == 'getcomingmovies') {
                title = '即将上映'
            } else if (name == 'gethotmovies') {
                title = '热映电影'
            } else {
                title = 'TOP电影'
            }
            this.setData({
                name, title,pno:0
            })
            this.loadMore()
        }
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
        this.loadMore()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})