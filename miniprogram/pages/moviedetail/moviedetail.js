// pages/moviedetail/moviedetail.js
//创建数据库对象
const db=wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        content:"", //保存用户评论信息
        score:0.5,//保存用户评论分数
        movieId:25779217,//保存电影id
        movie:{},//当前电影详情
        imgs:[], //上传图片,预览时图片
        fileIds:[], //上传图片id
        moviename:""
    },
    // 发表评论
    comment:function(){
        //如果当前用户未选中图片
        if(this.data.imgs.length==0){
            wx.showToast({
                title: '请选择图片',
            })
            return;
        }
        // 显示数据加载提示框
        wx.showLoading({
            title: '评论正在上传中...',
        });
        // 创建数组 rows 保存Promise异步对象
        var rows=[];
        // 创建循环 遍历每张选中图片
        for(var i=0;i<this.data.imgs.length;i++){
            // 为每张图片创建promise对象 完成上传操作
            rows.push(new Promise((resolve,reject)=>{
                var img=this.data.imgs[i];
                // 获取当前图片的后缀(拆分.搜索.正则)
                var reg= /\.\w+$/i;
                var type=reg.exec(img)[0];
                // 创建新文件名 当前时间+随机数
                var cloudPath=new Date().getTime()+Math.floor(Math.random()*9999)+type;
                // 上传当前图片
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath:img,
                    // 在data属性中添加数组fileIds保存图片路径
                    // 上传成功,保存fileID
                    success:(res=>{
                        var fid=res.fileID;
                        this.data.fileIds.push(fid);
                        // 上传成功,执行解析,开门
                        resolve();
                    })
                });
            }));//push end
        };//for end
        // 将用户评论信息与图片fileId保存到云数据库
        // 创建数据库对象
        // 所有的Promise执行完,才能执行下一步操作
        Promise.all(rows).then(res=>{
            // 获取用户评论内容
            var content=this.data.content;
            // 获取用户评分
            var score=this.data.score;
            // 获取当前电影id
            var id=this.data.movieId;
            // 获取图片fileID
            var fileIds=this.data.fileIds;
            // 获取当前电影名
            var moviename=this.data.moviename;
            // 添加到数据库集合comment
            db.collection("comment")
            .add({
                data:{
                    movieId:id,
                    content,
                    score,
                    fileIds,
                    moviename
                }
            })
            .then(res=>{
                // 添加成功,隐藏提示框
                wx.hideLoading();
                // 提示评论成功
                wx.showToast({
                    title: '评论成功',
                })
            })
            .catch(err=>{console.log(err)})
        })
    },
    //组件创建成功后调用云函数
    loadMore:function(){
        var id=this.data.movieId; 
        //显示数据加载提示框
        wx.showLoading({
            title: '正在拼命加载中...',
        })
        //调用云函数
        wx.cloud.callFunction({
            name:'getdetails',//云函数名
            data:{id}
        }).then(res=>{
            var movie=JSON.parse(res.result);
            this.setData({movie,moviename:movie.title});
            //隐藏加载提示框
            wx.hideLoading();
        }).catch(err=>{
            console.log(err)
        })
    },
    //选中图片并实现预览图片
    uploadFile:function(){
        wx.chooseImage({
            count: 9, //最多选中图片
            sizeType: ["original","compressed"],//图片类型,
            sourceType: ["album","camera"],//图片来源
            success: res=>{
                this.setData({
                    imgs:res.tempFilePaths
                })
            }
        })
    },
    // 用户在输入框输入内容触发改事件
    onContentChange:function(e){
        this.setData({
            content:e.detail
        })
    },
    // 用户评分时触发该事件
    onChangeScore:function(e){
        this.setData({
            score:e.detail
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            movieId:options.id
        })
        this.loadMore()
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