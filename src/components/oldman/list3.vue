<template>
	<div id="app" v-loading.fullscreen.lock="fullscreenLoading">
   <div class="goschool-nav">
     <el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 20px" @click="tiaojian = true">条件搜索</el-button>
    <div class="search-Input">
      <input type="text" placeholder="体检人姓名/身份证号" v-model="search">
    </div>
    <div class="search-icon" @click="Search()">
      <img src="../../assets/images/search.png" height="30" width="30">
    </div>
  </div>
    <el-dialog
      title="按条件查询"
      :visible.sync="tiaojian"
    >
      <div>
        <div class="tipDate">开始时间</div>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div>
        <div class="tipDate">结束时间</div>
        <el-date-picker
          v-model="value2"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </div>

      <span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="tiaojian = false;termSearch(value1,value2)">确 定</el-button>
		<el-button @click="tiaojian = false">取 消</el-button>
	</span>
    </el-dialog>
  <div class="content">
   <ul  class="listhead">
    <li>体检人姓名</li>
    <li>体检人身份证号</li>
    <li>提交时间</li>
    <li>失效时间</li>
    <li>手机号码</li>
  </ul>
  <ul  class="listhead font_color" v-for="(item,index) in data3">
    <li>{{item.physicalName}}</li>
    <li>{{item.physicalIdcard}}</li>
    <li>{{item.createTime}}</li>
    <li>{{item.updateTime}}</li>
    <li>{{item.physicalPhone}}</li>
  </ul>
</div>
<!-- 分页 -->
<div class="all" >
  <span>共&nbsp;<i>{{total}}</i>&nbsp;条</span>

  <template>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
      layout="prev, pager, next"
      :total="total"
      v-if="total <= 5 ? false:true"
      :page-size="5"
      @current-change="handleCurrentChange"
      >
    </el-pagination>
  </div>
</template>
</div>
</div>

</template>
<script >
  import {familyDoctor,checkStatus} from "./../../common/util.js"
  import axios from "axios"
  import {getLastDate} from "../../common/util";

  export default{
    data(){
     return{
      search:"",
      total:0,
      loginId:"",
      token:"",
      data3:[],
      fullscreenLoading:false,
       wuhan:"",
       value1:"",
       value2:"",
       fristimg:"",
       secondimg:"",
       tiaojian:false,
       startTime:"",
       endTime:"",
       radio:'',
       url:familyDoctor(),
    }
  },
  watch: {
    $route() {
      this.$router.go(0)
    }
  },
  created:function(){
   this.token = window.localStorage.getItem("token");
   this.loginId = window.localStorage.getItem("loginId");
   this.requestData()
 },
 methods:{
  //数据请求
  requestData:function(){
    let  _this=this
    checkStatus(_this)
    let url = familyDoctor();
    axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
      orderStatus:4,
      status:2,
      pageNum:1,
      pageSize:5
    }).then((response)=>{
      console.log(response)
     _this.data3=response.data.data.list
     _this.total=response.data.data.total
   })
  },
      // 分页
      handleCurrentChange:function(val){
        let url = familyDoctor();
        let _this=this
        if(!_this.search){
          axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
            orderStatus:4,
            status:2,
            pageNum:val,
            pageSize:5,
            beginDate:_this.startTime,
            endDate:_this.endTime,
            chooseWay:_this.radio
          }).then(function(response){

 _this.data3=response.data.data.list
})
}else{
  axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
    orderStatus:4,
    status:2,
    pageNum:val,
    pageSize:5,
    searchKey:_this.search
  }).then(function(response) {

  _this.total=response.data.data.total
  _this.data3 = response.data.data.list;
});
}

},
   //条件搜索
   termSearch:function(){
     let url = familyDoctor();
     let _this = this;
     checkStatus(_this)
     _this.startTime = getLastDate(arguments[0])
     _this.endTime = getLastDate(arguments[1])
       console.log(_this.startTime);
     console.log( _this.endTime);
     if(_this.startTime==""||_this.endTime==""){

         this.dialogVisible = true
         this.$message("请选择条件")
         return
       }

     axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
       {
         orderStatus:4,
         pageSize:5,
         pageNum:1,
         beginDate:_this.startTime,
         endDate:_this.endTime,
       }).then(function(response) {
       _this.data3 = response.data.data.list;
       _this.total = response.data.data.total;

     });
   },
        // 搜索
        Search:function(){
          let url = familyDoctor();
          let _this = this;
          console.log(_this.search)
          axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
            orderStatus:4,
            status:2,
            pageNum:1,
            pageSize:5,
            searchKey:_this.search
          }).then(function(response) {

            _this.total=response.data.data.total
            _this.data3 = response.data.data.list;
          })
        }
      },
      computed: {
        familyDoctor,
        checkStatus
      }
    }
  </script>
  <style scoped>
  .goschool-nav{
    height:70px;
    position: relative;
    background-color:white;
  }
  .nav-date{
    height: 70px;
  }
  .nav-date .el-button--text{
    height: 50px;
    width: 147px;
    padding: 0;
    color: white;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 20px;
    background-color: #fb8ca6;
  }
  .el-date-editor.el-input {
    width: 228px;
  }
  .search-Input{
    position: absolute;
    top: 50%;
    right: 70px;
    margin-top: -25px;
    float: left;

  }
  .search-Input input{
   height: 48px;
   width: 433px;
   outline: none;
   padding-left: 10px;
   border: solid 1px #e5e5e5;
   border-radius: 5px 0px 0px 5px;
 }
 .search-icon{
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -25px;
  background-color: #fb8ca6;
  border-radius: 0px 5px 5px 0px;
}
.listhead{
  width: 100%;
  height: 70px;
  margin-top: 10px;
}
.listhead li{
  float: left;
  height: 70px;
  line-height: 70px;
  text-align: center;
  white-space: nowrap;
  font-size: 14px;
  color: #fb8ca6;
  background-color: #ffffff;
  margin-right:0.2%;
}
.font_color li{
  color: #5f5f5f;
}
.listhead li:nth-of-type(1),.listhead li:nth-of-type(5){
  width: 14.5%;
}
.listhead li:nth-of-type(2){
  width: 30%;
}
.listhead li:nth-of-type(3),.listhead li:nth-of-type(4){
  width: 20%;
}
.all {
  width: 100%;
  float: left;
  line-height: 30px;
  margin-top: 10px;
  text-align: center;
}
.all span {
  display: block;
  margin: auto;
  width: 70%;
  text-align: center;
}
.all  span i{
  color: #fb8ca6;
}
</style>
