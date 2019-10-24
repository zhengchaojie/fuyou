<template>
  <div id="app" v-loading.fullscreen.lock="fullscreenLoading" >
   <div class="goschool-nav">
     <el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 20px" @click="tiaojian = true">条件搜索</el-button>
    <div class="search-Input">
      <input type="text" v-model="search" placeholder="体检人姓名/身份证号">
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
         <!--<span style="display: inline-block;width: 15px"></span> <el-radio label="1" >武昌居民</el-radio>-->
          <!--<el-radio label="2" >配偶为武昌居民</el-radio>-->
          <!--<el-radio label="3" >武昌常驻人员</el-radio>-->
        <!--</el-radio-group>-->
        <br/>
        <el-select v-model="radio"  style="width: 228px;margin-top: 5px;height: 30px;">
          <el-option value="全部">全部</el-option>
          <el-option value="武昌居民">武昌居民</el-option>
          <el-option value="配偶为武昌居民">配偶为武昌居民</el-option>
          <el-option value="武昌常驻人员">武昌常驻人员</el-option>
        </el-select>
      </div>
       <div style="font-size: 0;text-align: center;padding-top: 20px">
		  <el-button style="background-color: #20a0ff;color: white" @click="tiaojian = false;termSearch(value1,value2)">确 定</el-button>
		<el-button @click="tiaojian = false">取 消</el-button>
       </div>
    </el-dialog>
  <div class="content">
    <ul  class="listhead">
      <li>体检人姓名</li>
      <li>体检人身份证号</li>
      <li>武汉户籍</li>
      <li>提交时间</li>
      <!--<li>失效时间</li>-->
      <li>证件照片</li>
      <li>手机号码</li>
      <li>操作</li>
    </ul>
    <ul  class="listhead font_color" v-for="(item,index) in data3">
      <li>{{item.physicalName}}</li>
      <li>{{item.physicalIdcard}}</li>
      <li v-if="item.chooseWay == 1">是</li>
      <li v-else-if="item.chooseWay == 2">否</li>
      <li v-else-if="item.chooseWay == 3">否</li>
      <li v-else>{{wuhan}}</li>
      <!--武汉户籍-->
      <li >{{item.createTime}}</li>
      <li class="iconfont icon-tu_pian" @click="carmer(item)"></li>
      <!--证件照片-->
      <!--<li>{{item.order_time}}失效时间</li>-->
      <li>{{item.physicalPhone}}</li>
      <li>
          <div class="Sure" @click="SureData(item,index)"><i class="iconfont icon-queding" @click="SureData"></i> </div>
        <div class="Return" @click="returnData(item,index)"><i class="iconfont icon-cuowu" @click="returnData"></i></div>
      </li>
    </ul>
  </div>
    <div  class="miandiv" v-show="cramer">
       <div class="contantdiv"  >
         <span class="spacesp" ></span><span class="iconfont icon-cuowu" @click="guanbi"></span>
         <div class="shop_picture" id="shop_picture" title="点击查看大图"   @click="xuanimg">
           <img class="shop_pic" id="shop_pic"   :src="fristimg">
         </div>
         <div class="shop_thumbnail">
           <div class="thu"  @click="shwoimg1()" >
             <img id="thu1" :src="fristimg">
           </div>
           <div class="thu" v-if="secondimg != ''"  @click="shwoimg2()" >
             <img id="thu2"   :src="secondimg"/>
           </div>
         </div>
       </div>
    </div>
    <div  class="miandiv1" v-show="xuanzhuan">
      <span class="spacesp" ></span><span class="iconfont icon-cuowu" @click="guanimg"></span>
             <div class="contantdiv1">
            <img id="xuanimg" style="width: auto;max-width: 420px;height: 550px">
               <div style="text-align: center">
               <span class="iconfont icon-zuoxuanzhuan" @click="leftimg"></span>
               <span class="iconfont icon-youxuanzhuan" @click="rightimg"></span></div>
             </div>
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
        :page-size="5"
        v-if="total <= 5 ? false:true"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </template>
</div>
</div>

</template>

<script >
import axios from "axios";
import {familyDoctor,getLastDate2,checobox,checkStatus} from "./../../common/util.js";
import {getLastDate} from "../../common/util";
export default {
  data() {
    return {
      search: "",
      disabled:false,
      dialogVisible:false,
      url:familyDoctor(),
      data3: [],
      id:"",
      radio:'',
      total: 0,   // 分页总数
      value1:'',
      value2:'',
      token:"",
      loginId:"",
      fullscreenLoading:false,
      wuhan:"",
      cramer: false,
      xuanzhuan:false,
      proveimg:[],
      fristimg:"",
      secondimg:"",
      tiaojian:false,
      startTime:"",
      endTime:"",
      selectway:""
    };
  },
  created: function() {
    this.token = window.localStorage.getItem("token");
    this.loginId = window.localStorage.getItem("loginId");
    this.id=window.localStorage.getItem("id")
    this.request();
  },
  watch:{
    $route() {
      this.$router.go(0)
    },
    dialogVisible:function(){
      this.radio = ''
    }
  },
  methods: {
    xuanimg(){
       let xuanimg = document.getElementById("xuanimg");
       let  shop_pic = document.getElementById("shop_pic");
       xuanimg.src = shop_pic.src;
       this.xuanzhuan = true;
      let current = 0;
      xuanimg.style.transform =  'rotate('+current+'deg)';
    },

   rightimg(){
      let xuanimg = document.getElementById("xuanimg");

        let start =  xuanimg.style.transform;
        let a = parseFloat(start.substring(7).split(','))
       if(a == 0 ){
         let current = 90;
         xuanimg.style.transform =  'rotate('+current+'deg)';
       }else if(a == 90 || a == -270){
         let current = 180;
         xuanimg.style.transform =  'rotate('+current+'deg)';
       }else if(a == 180  || a == -180){
         let current = 270;
         xuanimg.style.transform =  'rotate('+current+'deg)';
       }else if(a == 270  || a == -90){
         let current = 0;
         xuanimg.style.transform =  'rotate('+current+'deg)';
       }

    },
    guanimg(){
      this.xuanzhuan = false;
    },
    leftimg(){
      let xuanimg = document.getElementById("xuanimg");

      let start =  xuanimg.style.transform;
      let a = parseFloat(start.substring(7).split(','))
      if(a == 0 ){
        let current = -90;
        xuanimg.style.transform =  'rotate('+current+'deg)';
      }else if(a == -90  || a == 270){
        let current = -180;
        xuanimg.style.transform =  'rotate('+current+'deg)';
      }else if(a == -180  || a == 180){
        let current = -270;
        xuanimg.style.transform =  'rotate('+current+'deg)';
      }else if(a == -270  || a == 90){
        let current = 0;
        xuanimg.style.transform =  'rotate('+current+'deg)';
      }
    },
    //查看图片
     carmer(obj){
          // window.overflowY = "hidden";
          this.cramer = true;
           let img =JSON.stringify(obj.proveImg);
           let arr = img.split(',');
           if(arr.length >1){
              let a = arr[0];
              let b = arr[1];
              this.fristimg = a.substr(1,a.length-1);
              this.secondimg = b.substr(0,a.length-1);
           } else {
               this.fristimg =  obj.proveImg;
               this.secondimg = "";
           }
     },
    shwoimg1(){
      let  shop_pic = document.getElementById("shop_pic");
      let  thu1 = document.getElementById("thu1");
      let  thu2 = document.getElementById("thu2");
      shop_pic.src = thu1.src;
      thu1.style.border = "1px solid #0185FF";
      thu2.style.border = 0;
      console.log("1")
    },
    shwoimg2(){
      let  shop_pic = document.getElementById("shop_pic");
      let  thu2 = document.getElementById("thu2");
      let  thu1 = document.getElementById("thu1");
      shop_pic.src =  thu2.src ;
      thu2.style.border = "1px solid #0185FF";
      thu1.style.border = 0;
      console.log("2")
    },
    //关闭图片
    guanbi(){
      this.cramer = false;
      window.overflowY = "auto";
      var  thu1 = document.getElementById("thu1");
      var  thu2 = document.getElementById("thu2");
      thu1.style.border = 0;
      thu2.style.border = 0;
    },
    //数据交互
    request: function() {
      let _this = this;
       checkStatus(_this)
      let url=familyDoctor()
      axios.post(_this.url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
        pageSize:5,
        pageNum:1,
        orderStatus:1,
      }).then(function(response) {

        let listArray = response.data.data.list;
        _this.data3 = listArray;
        _this.total = response.data.data.total;
        _this.value1 = '', _this.value2 = ''
      });
    },
     //确定
    SureData: function(item, index) {
      let _this = this;
      checkStatus(_this)
      let url = familyDoctor();
      this.$confirm("体检人预约申请通过, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axios.post(_this.url+"/wcfy/Reservation/updateNiptStatus" + "?loginId="+_this.loginId+"&token="+_this.token,{
          id:item.id,
          orderStatus:2,
          phone:item.physicalPhone
        }).then(response => {
          this.$message({
            message:response.data.message,
            type: 'success'
          });
          this.request();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    //驳回
    returnData: function(item, index) {
      let _this = this;
       checkStatus(_this)
      let url = familyDoctor();
      this.$confirm("将驳回该体检人预约申请, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          axios.post(_this.url+"/wcfy/Reservation/updateNiptStatus" + "?loginId="+_this.loginId+"&token="+_this.token,{
            id:item.id,
            phone:item.physicalPhone,
            orderStatus:4
          }).then(response => {

               this.$message({
                message:response.data.message,
                type: 'success'
              });
              this.request();
            });
        }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
        });
    },
    // 分页
    handleCurrentChange: function(val) {
      let _this = this;
       checkStatus(_this)
      let url=familyDoctor()
      if (!_this.search) {
       axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
       {
         orderStatus:1,
         status:0,
         pageNum:val,
         pageSize:5,
         beginDate:_this.startTime,
         endDate:_this.endTime,
         chooseWay:_this.selectway
       }).then(function(response){
         console.log("分页");
         console.log(response);
        _this.data3=response.data.data.list
        _this.total = response.data.data.total
      })
     } else {
       axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
       {
         orderStatus:1,
         status:0,
         pageNum:val,
         pageSize:5,
         searchKey:_this.search
       }).then(function(response) {
        _this.data3 = response.data.data.list;
        _this.total = response.data.data.total;
      });
     }
    },
    // 搜索
    Search:function(){
      let _this = this;
       checkStatus(_this);
      let url=familyDoctor()
      axios.post(url+"/wcfy/Reservation/findNiptInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
        orderStatus:1,
        status:0,
        pageNum:1,
        searchKey:_this.search,
        pageSize:5
      }).then(function(response) {
        _this.total=response.data.data.total
        _this.data3 = response.data.data.list;
      });
      // let s = _this.$refs.checkboxs;
      // checobox(s);
    },
    //条件搜索
    termSearch:function(){
      let url = familyDoctor();
      let _this = this;
      checkStatus(_this)
      _this.startTime = getLastDate(arguments[0])
      _this.endTime = getLastDate(arguments[1])
      console.log(_this.radio);
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
          orderStatus:1,
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

  },

  computed: {
    familyDoctor,
     checkStatus
  },
  components: {

  }
};
</script>
<style scoped>
  .miandiv{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 2001;}
  .miandiv1{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 4001;}
  .contantdiv{position: absolute;top: 15%;width: 614px;height: 430px;left: 50%;transform: translateX(-50%);background: #fff;
    border-radius: 2px;box-shadow: 0 1px 3px rgba(0,0,0,.3);box-sizing: border-box;margin-bottom: 50px;font-size: 0;}
  .contantdiv1{position: absolute;top: 2%;height: 600px;left: 50%;transform: translateX(-50%);}
  .icon-cuowu{font-size: 18px;color: #BBBBBB}
  .icon-queding{font-size: 18px;}
  .icon-zuoxuanzhuan{font-size: 40px}
  .icon-youxuanzhuan{font-size: 40px}
  .icon-tu_pian{font-size: 25px !important;}
  .tupian{
    width: 800px;
    height: 300px;
  }
  .el-date-editor.el-input {
    width: 228px;
  }
  .spacesp{display: inline-block;width: 97%;height:15px;}
  .shop_picture{width: 590px;height: 300px;margin-left: 2%;}
  .shop_pic{width: 100%;height: 300px;}
  .shop_thumbnail{display: flex;margin-left: 2%;padding-bottom: 2%}
  .thu{width: 100px;height: 100px;border: 1px solid #dfdfdf;margin-top: 5px;margin-right: 5px;display: inline-block;}
  .thu img{width: 100px;height: 100px;}


  #cramerid >>>  .el-dialog--small{width: 55% ;height: 500px ;}



  /*之前的*/
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
  width: 10%;
}
.listhead li:nth-of-type(2){
  width: 20%;
}
.listhead li:nth-of-type(3){
  width: 10%;
}
.listhead li:nth-of-type(4){
  width: 21.5%;
}
.listhead li:nth-of-type(5){
  width: 10%;
  cursor: pointer
}
.listhead li:nth-of-type(6){
  width: 15%;

}
.listhead li:nth-of-type(7){
  width: 12%;
  margin-right:0;
  cursor: pointer;
}
.Sure,.Return{
 width: 50%;
 float: left;
 color: #fb8ca6
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
.all span i {
  color: #fb8ca6;
}
#make > div{
  margin-left: 39px;
  margin-top: 22px;
  position: absolute;
}
.tick{
  height: 162px;
  width: 5%;
  margin-left: 1%;
  float: left;
  background-color: white;
  text-align: center;
}
#set_time{
  width: 230px;
  height: 27px;
}

#tick > div > div.el-dialog__body > div:nth-child(2){
  margin-top: 20px
}
.text_phone{
  text-align: left;
}
.text_phone >span{
  margin-right: 10px;
  margin-left: 2px;
}
.text_intro p{
  width: 60.14px;
  float: left;
}
.text_intro p:last-of-type{
 line-height: 23px
}
.text_intro textarea{
  width: 208px;
  resize: none;
  padding: 3px 10px;
  border-color: #bfcbd9
}
.el-button--primary{
  float: left
}
</style>
