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
      <div class="text_phone">
  <span class="font_color">
    是否武昌
  </span>
        <!--<el-radio-group v-model="radio">-->
          <!--<span style="display: inline-block;width: 15px"></span>   <el-radio label="1" >武昌居民</el-radio>-->
          <!--<el-radio label="2" >配偶为武昌居民</el-radio>-->
          <!--<el-radio label="3" >武昌常驻人员</el-radio>-->
        <!--</el-radio-group>-->
        <br/>
        <el-select v-model="radio"  style="width: 228px;margin-top: 5px;height: 30px;margin-left: 0">
          <el-option value="全部">全部</el-option>
          <el-option value="武昌居民">武昌居民</el-option>
          <el-option value="配偶为武昌居民">配偶为武昌居民</el-option>
          <el-option value="武昌常驻人员">武昌常驻人员</el-option>
        </el-select>
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
        <li>武昌户籍</li>
        <li>提交时间</li>
        <li>完成时间</li>
        <li>手机号码</li>
  </ul>
   <ul  class="listhead font_color" v-for="(item,index) in data3">
        <li>{{item.physicalName}}</li>
        <li>{{item.physicalIdcard}}</li>
     <li v-if="item.chooseWay == 1">是</li>
     <li v-else-if="item.chooseWay == 2">否</li>
     <li v-else-if="item.chooseWay == 3">否</li>
     <li v-else>{{wuhan}}</li>
        <li>{{item.createTime}}</li>
        <li>{{item.successTime}}</li>
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
import axios from "axios"
import {familyDoctor,checkStatus} from "./../../common/util.js"
import {getLastDate} from "../../common/util";

export default{
  data(){
   return{
    dialogVisible: false,
    search:"",
    total:0,
    data3:[],
    id:'',
    value1:'',
     value2:"",
    loginId:"",
    token:"",
    dialogV:true,
    fileList2: [],
    ids:'',
    fullscreenLoading:false,
     wuhan:"",
     fristimg:"",
     secondimg:"",
     tiaojian:false,
     startTime:"",
     endTime:"",
     radio:'',
     selectway:"",
     url:familyDoctor(),
  }
},
created:function(){
   this.token = window.localStorage.getItem("token");
      this.loginId = window.localStorage.getItem("loginId");
  this.ids=window.localStorage.getItem("id")
  this.requestData()
},
watch:{
  value1:function(){
    let url = familyDoctor();
     checkStatus(this)
      axios.get(url + "/whjtys/physical/tjManagement?imgFlag="+this.value1+"&searchKey=" + this.search+"&loginId="+this.loginId+"&token="+this.token).then(response=>{
        let data = response.data.pagehelper
        this.data3 = data.list
        this.total = data.total
    })
  },
    $route() {
      this.$router.go(0)
    }
},
methods:{
  //数据交互
  requestData:function(){
    let _this=this;
     checkStatus(_this)
    let url = familyDoctor();
   axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
        orderStatus:3,
        status:1,
        pageNum:1,
        pageSize:5
      }).then(function(response){
        console.log(response)
        let listArray=response.data.data.list
        _this.data3=listArray
        _this.total=response.data.data.total
      })
    },
  // 分页
  handleCurrentChange:function(val){
    let url = familyDoctor()
    let _this=this
     checkStatus(_this)
    if(!_this.search){
     axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
       orderStatus:3,
        status:1,
        pageNum:val,
        pageSize:5,
       beginDate:_this.startTime,
       endDate:_this.endTime,
       chooseWay:_this.selectway
      }).then(function(response){
      _this.data3=response.data.data.list
    })
    }else{
     axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
       orderStatus:3,
        status:1,
        pageNum:val,
        pageSize:5,
        searchKey:_this.search
      }).then(function(response) {
        let data = response.data.data
      _this.total=data.total
      _this.data3 = data.list
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

    if(_this.startTime==""&&_this.endTime==""){
      if(_this.radio == ""){

        this.$message("请选择条件")
        return
      }
    }else if(_this.startTime==""||_this.endTime==""){

      this.$message("请选择条件")
      return
    }
    if(_this.radio == "全部"){
      _this.selectway = "";
    }else if(_this.radio == "武昌居民"){
      _this.selectway = 1;
    }else if(_this.radio == "配偶为武昌居民"){
      _this.selectway = 2;
    }else if(_this.radio == "武昌常驻人员"){
      _this.selectway = 3;
    }
    axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
      {
        orderStatus:3,
        pageSize:5,
        pageNum:1,
        beginDate:_this.startTime,
        endDate:_this.endTime,
        chooseWay:_this.selectway
      }).then(function(response) {

      _this.data3 = response.data.data.list;
      _this.total = response.data.data.total;

    });
  },
    // 搜索
    Search:function(){
      let url = familyDoctor()
      let _this = this
       checkStatus(_this)
     axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
       orderStatus:3,
        status:1,
        pageNum:1,
        pageSize:5,
        searchKey:_this.search
      }).then(function(response) {
        let data = response.data.data
      _this.total=data.total
      _this.data3 = data.list
    });
    },
}	,
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
 .el-date-editor.el-input {
   width: 228px;
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
 .listhead li:nth-of-type(1){
   width: 10.5%;
 }
 .listhead li:nth-of-type(2){
   width: 20%;
 }
 .listhead li:nth-of-type(3){
   width: 9%;
 }
 .listhead li:nth-of-type(4){
   width: 18%;
 }
 .listhead li:nth-of-type(5){ width: 18%;}
 .listhead li:nth-of-type(6){
   width: 23%;
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
.el-select{
  margin-top: 22px;
  margin-left: 39px;
}
.content_border > dl:nth-of-type(1) > dd:nth-of-type(1){
  line-height: 33px;
  overflow: hidden;
}
#upload > div > div.el-dialog__footer{
  text-align: center;
}
#upload > div > .el-dialog__header > .el-dialog__title{
  color: #979797 !important;
}
#upload > div > div.el-dialog__footer > span {
 text-align: center;
}
.el-select{
  width: 160px
}

</style>
