<template>
  <div id="app" >
    <div v-show="power">
  <div  v-show="child">
    <div class="goschool-nav">
      <!--<span style="margin-left: 5%;cursor: pointer;font-size: 25px;color: #9d9d9f" @click="fanhui" class="iconfont icon-iconfanhuishangyiji"></span>-->
      <span style="font-size: 22px;font-weight: 700;margin-left: 5%">{{schoolname}}</span>
      <div style="display: inline-block;font-size: 18px;margin-left: 8%;">
        <span>共有班级</span><span style="color:#fb8ca6 ">{{Sdata.classCount}}</span><span>个,</span>
        <span>总学生数</span><span style="color:#fb8ca6 ">{{Sdata.studentCount}}</span><span>人</span></div>
      <div style="display: inline-block;font-size: 18px;margin-left: 5%;">
        <span>缴费人数</span><span style="color:#fb8ca6 ">{{Sdata.payCount}}	</span><span>人,</span>
        <span>缴费金额</span><span style="color:#fb8ca6 ">{{Sdata.totalAmount}}</span><span>元</span></div>
      <!--<el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 10%" @click="xinjian = true">新建班级</el-button>-->
    </div>
    <div class="content" style="height: 480px;overflow: auto;text-align: center" >
      <div class="xiao">
        <div class="xiaoban" v-for="(item,index) in classinfo" >
          <div class="topdiv" v-if="sub(item.className) == '小'"></div>
          <div class="topdivz" v-else-if="sub(item.className) == '中'"></div>
          <div class="topdivd" v-else-if="sub(item.className) == '大'"></div>
          <div class="closediv">
            <span class="iconfont ">&nbsp;</span>
          </div>
          <div class="textdiv">
            <div class="banji" v-if="sub(item.className) == '小'">{{item.className}}</div>
            <div class="banjiz" v-else-if="sub(item.className) == '中'">{{item.className}}</div>
            <div class="banjid" v-else-if="sub(item.className) == '大'">{{item.className}}</div>
            <p style="font-size: 15px;margin-top: 10px">班级人数</p>
            <p style="font-weight: 700;font-size: 22px">{{item.classCount}}</p>
          </div>
          <div class="caozuodiv">
            <div class="leftdiv"> <span class="iconfont icon-sousuo" @click="chakan(item)"></span>  </div>
            <div class="rightdiv">
              <!--<input type="file" style="position: absolute;left: 2px;opacity: 0;width: 72px;cursor: pointer;"/> -->
              <span class="iconfont icon-xiazai" @click="down(item)"></span></div>
          </div>
        </div>
        </div>
    </div>


  </div>
    <div class="content" v-show="xianxi">
      <div class="goschool-nav" >
        <span style="margin-left: 5%;cursor: pointer;font-size: 25px;color: #9d9d9f" @click="fanhui" class="iconfont icon-iconfanhuishangyiji"></span>
        <span style="font-size: 22px;font-weight: 700;margin-left: 5%">{{classname}}</span>
        <div class="jiaofei" >
        <span>已缴费人数:</span>
        <span style="color: #fb8ca6">{{yjf}}</span>
        <span>未缴费人数:</span>
        <span style="color: #bbbbbb">{{wjf}}</span>
        </div>
        <!--<el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 10%" @click="xinjian = true">新建班级</el-button>-->
      </div>
      <div class="overScroll">
      <ul class="listhead" v-for="(item,index) in data1">
        <li v-for="(items,indexs) in item">
          <span v-if="items == 0">暂无</span>
          <span v-else-if="items != 0">{{items}}</span>
        </li>

      </ul>
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
    </div>
</template>

<script>
  import axios from "axios";
  import {familyDoctor, getLastDate2, checobox, checkStatus} from "./../../common/util.js";
  import {getLastDate} from "../../common/util";
    export default {
        name: "class",
      inject:['reload'],
      data(){
          return{
             Sdata:[],
            classinfo:[],
            child:true,
            xianxi:false,
            power:true,
            url: familyDoctor(),
            data1:[],
            total:"",
            classtype:"",
            token:"",
            loginId:"",
            id:"",
            classname:"",
            schoolname:"",
            schoolid:"",
            yjf:"",
            wjf:""
          }
      },
      created: function () {
        this.token = window.localStorage.getItem("token");
        this.loginId = window.localStorage.getItem("loginId");
        this.id = window.localStorage.getItem("id")
        this.requestData();
      },
      watch: {
        $route() {
          this.$router.go(0)
        },
        dialogVisible: function () {
          this.radio = ''
        }
      },
      mounted:function(){
          this.schoolid = window.localStorage.getItem("schoolid");
          //let roleid = window.localStorage.getItem("id");
          this.schoolname = window.localStorage.getItem("schoolname");
      },
      methods:{
          //字符串截取
          sub(value){
              let a = value.substr(0,1);
              return a;
          },
        //返回上一页
        fanhui(){
          this.child = true;
          this.xianxi = false;
          this.reload(); //局部刷新
          //this.$router.go(0);刷新整页
          //this.requestData();
        },

          //请求数据
          requestData(){
             //获取学校的账号名称
            let schoolid = window.localStorage.getItem("schoolid");
            //let schoolid = 1;
              let _this = this;
              checkStatus(_this);
              let url=familyDoctor();
              axios.post(_this.url+"/wcfy/zytj/selectClassInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
                   schoolId:schoolid
              }).then(function(response) {
                     _this.Sdata = response.data.data;
                //console.log(_this.Sdata);
                     _this.classinfo = response.data.data.classInfo;
               // console.log(_this.classinfo) //班级种类信息
              })
          },
         //查看班级详情
         chakan(obj){

             this.classname = obj.className;
             let _this = this;
             checkStatus(_this);
             let url=familyDoctor();
             this.xianxi=true;
             this.child =false;
             let Classtype = obj.classType;
             _this.classtype = Classtype;
             axios.post(_this.url+"/wcfy/zytj/classMedicalInfo" + "?loginId="+_this.loginId+"&token="+_this.token,{
               schoolId:_this.schoolid,
               classType:_this.classtype,
               pageNum:1,
               pageSize:5
             }).then((response)=>{
                      console.log(response);
                     this.data1 = response.data.data.list.list;
                     this.total = response.data.data.list.total;
                     _this.yjf = response.data.data.jf;
                     _this.wjf = response.data.data.wjf;
                     console.log(_this.yjf);
                     console.log(_this.wjf);
             })
         },

         //下载文档
         down(obj){
           let classtype = obj.classType;  //班级名称
           let schoolid = this.schoolid;
           let _this = this;
           checkStatus(_this);
           let url=familyDoctor()+"/wcfy/zytj/classMedicalExcle";
          // let url="http://chensheng.premier-tech.cn/wcfy/zytj/classMedicalExcle";
           axios.get(url+"?schoolId="+schoolid+"&classType="+classtype+"&loginId="+_this.loginId+"&token="+_this.token,{} )
             .then(function(response){
              //  console.log(response);
               if(window.navigator.userAgent.indexOf('AppleWebKit') == 36) {
                 window.open(response.config.url)
               }else{
                 window.location.href = response.config.url
               }
             })
         },
        // 分页
        handleCurrentChange: function(val) {
          let _this = this;
          let schoolid = _this.schoolid;
          checkStatus(_this);
          let url=familyDoctor();
          //console.log(val);
            axios.post(url+"/wcfy/zytj/classMedicalInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
              { schoolId:schoolid,
                pageNum:val,
                pageSize:5,
                classType:_this.classtype
              }).then(function(response){
              _this.data1=response.data.data.list.list;
              _this.total = response.data.data.list.total;
            })

        },
      }
    }
</script>

<style scoped>
  .jiaofei{display: inline-block;font-size: 18px;padding-left: 45%;}
  .xiao{display: inline-block;}
  .zhong{display: inline-block;}
  .da{display: inline-block;}
  .xiaoban{width: 175px;height: 220px;background-color: white;border-radius: 5px;text-align: center;
    display: inline-block;margin-left: 15px;margin-top: 15px;box-shadow: 0 1px 3px rgba(193, 188, 188,.3);}
  .topdiv{background-color: #fb8ca6;height: 7px;border-top-left-radius: 5px;border-top-right-radius: 5px;}
  .closediv{text-align: right;padding-right: 6px;}
  .banji{background-color: #fb8ca6;width: 70px;height: 70px;border-radius: 50%;line-height: 70px;font-size: 18px;margin-left: 28.5%;color: white}
  .leftdiv{width: 45%;display: inline-block;border-right: 1px solid #dedede;cursor: pointer;}
  .rightdiv{width: 45%;display: inline-block;cursor: pointer;position: relative;}
  .upload-demo{position: absolute;left: 0;}
  .caozuodiv{margin-left: 8px;margin-right: 8px;border-top:  1px solid #dedede;padding-top: 5px;margin-top: 10px}
  .icon-cuowuguanbi-{color: #dedede;cursor: pointer;}
  .icon-sousuo{font-size: 20px;}
  .icon-shangchuan{font-size: 20px;color: #fb8ca6;}
  .icon-xiazai{font-size: 20px;color: #fb8ca6;}
  .topdivz{background-color: #94e2ff;height: 7px;border-top-left-radius: 5px;border-top-right-radius: 5px;}
  .banjiz{background-color: #94e2ff;width: 70px;height: 70px;border-radius: 50%;line-height: 70px;font-size: 18px;margin-left: 28.5%;color: white}
  .topdivd{background-color: #7cfdc8;height: 7px;border-top-left-radius: 5px;border-top-right-radius: 5px;}
  .banjid{background-color: #7cfdc8;width: 70px;height: 70px;border-radius: 50%;line-height: 70px;font-size: 18px;margin-left: 28.5%;color: white}
  .bottom{text-align: center;height: 50px;width: 100%;padding-top: 10px;}
  .price{background-color: #0185ff;width: 150px;height: 40px;color: white;border: 0;border-radius: 5px;margin-right: 30px;}
  .save{background-color: #fb8ca6;width: 150px;height: 40px;color: white;border: 0;border-radius: 5px;}
  button{ outline:none; cursor: pointer;}
  .topul{width: 100%;height: 50px;font-size: 15px;text-align: center;background-color: #ffeaef;}
  .topul li{float: left;border: 1px solid #fb8ca6;margin: 0 0 -1px -1px;height: 50px;line-height: 50px;}
  .topul li:nth-of-type(1){
    width: 8%;
  }
  .topul li:nth-of-type(2){
    width: 8%;
  }
  .topul li:nth-of-type(3){
    width: 8%;
  }
  .topul li:nth-of-type(4){
    width: 10%;
  }
  .topul li:nth-of-type(5){
    width: 13%;
  }
  .topul li:nth-of-type(6){
    width: 8%;
  }
  .topul li:nth-of-type(7){
    width: 36%;
  }
  .topul li:nth-of-type(8){
    width: 8.25%;
  }
  .zengzhi1{height: 25px;line-height: 25px;border-bottom: 1px solid #fb8ca6;}
  .zengzhi2{height: 25px;line-height: 24px;}
  .zengzhi3{line-height: 50px}
  .zz{display: block;float: left;width: 24%;border-right: 1px solid #fb8ca6;}
  .zz1{display: block;float: left;width: 28%;border-right: 1px solid #fb8ca6;}
  .zz2{display: block;float: left;width: 23%;}

  .miandiv{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 2001;}
  .miandiv1{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 4001;}
  .contantdiv{position: absolute;top: 15%;width: 80%;left: 50%;transform: translateX(-50%);background: #fff;
    border-radius: 2px;box-shadow: 0 1px 3px rgba(0,0,0,.3);box-sizing: border-box;margin-bottom: 50px;}
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
    line-height: 70px;
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
  .overScroll{
    overflow-y: hidden;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  .listhead{
    width: 100%;
    height: 70px;
    margin-top: 10px;
    white-space: nowrap;
  }
  .listhead li{
    display: inline-block;
    height: 70px;
    line-height: 70px;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    color: #fb8ca6;
    background-color: #ffffff;
    margin-right:2px;
    width: 110px;
  }
  .font_color li{
    color: #5f5f5f;

  }
  /*.listhead li:nth-of-type(1){*/
    /*width: 11%;*/
  /*}*/
  /*.listhead li:nth-of-type(2){*/
    /*width: 12%;*/
  /*}*/
  /*.listhead li:nth-of-type(3){*/
    /*width: 13%;*/
  /*}*/
  /*.listhead li:nth-of-type(4){*/
    /*width: 11%;*/
  /*}*/
  /*.listhead li:nth-of-type(5){*/
    /*width: 15%;*/
  /*}*/
  /*!*.listhead li:nth-of-type(6){*!*/
  /*!*width: 15%;*!*/

  /*!*}*!*/
  /*.listhead li:nth-of-type(6){*/
    /*width: 11%;*/

  /*}*/
  /*.listhead li:nth-of-type(7){*/
    /*width: 11%;*/

  /*}*/
  /*.listhead li:nth-of-type(8){*/
    /*width: 14%;*/

  /*}*/
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
