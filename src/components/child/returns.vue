<template>
  <div id="app" >
    <div v-show="first">
    <div class="goschool-nav">
      <!--<span style="margin-left: 5%;cursor: pointer;font-size: 25px;color: #9d9d9f" @click="fanhui" class="iconfont icon-iconfanhuishangyiji"></span>-->
      <el-button   class="shaixuan" @click="tiaojian = true">条件筛选</el-button>
      <el-button   class="shenqing" @click="shenqing = true">退费申请</el-button>
      <el-button   class="queren" @click="caozuo" v-show="queren">申请操作</el-button>
      <el-dialog title="条件筛选" :visible.sync="tiaojian">

         <el-select v-model="selected">
           <el-option value="全部">全部</el-option>
           <el-option value="通过">通过</el-option>
           <el-option value="驳回">驳回</el-option>
           <el-option value="申请中">申请中</el-option>

         </el-select>
      <div style="font-size: 0;text-align: center;padding-top: 20px;margin-top: 140px;">
      <el-button style="background-color: #20a0ff;color: white" @click="tiaojian = false;shaixuan(selected)">确 定</el-button>
      <el-button @click="tiaojian = false">取 消</el-button>
      </div>
      </el-dialog>
      <!--<el-dialog title="退费申请" :visible.sync="shenqing">-->
        <!--<span>学生家长</span>-->
        <!--<el-input v-model="jiazhang"></el-input>-->
        <!--<span>学生姓名</span>-->
        <!--<el-input v-model="uname"></el-input>-->
        <!--<span>退费项目</span>-->
        <!--<div>-->
          <!--<i class="iconfont icon-duigou">体检费</i>-->
          <!--<i class="iconfont icon-duigou">氟防龋治疗</i>-->
          <!--<i class="iconfont icon-duigou">视力检查</i>-->
          <!--<i class="iconfont icon-duigou">血红蛋白</i>-->
          <!--<i class="iconfont icon-duigou">听力筛查</i>-->
          <!--<i class="iconfont icon-duigou">心理行为筛查</i>-->
          <!--<i class="iconfont icon-duigou">血铅</i>-->
          <!--<i class="iconfont icon-duigou">乙肝五项</i>-->
          <!--<i class="iconfont icon-duigou">血型(ABO+RH)</i>-->

        <!--</div>-->

      <!--</el-dialog>-->
      <div  class="miandiv" v-show="shenqing">
      <div class="contantdiv"  >
     <p class="ptittle">退费项目</p>
        <span>学生姓名</span>
        <el-input v-model="uname"></el-input>
        <span>家长姓名</span>
        <el-input v-model="jiazhang"></el-input>
        <span>退费项目</span>
        <div  style="display: flex;">
            <div class="t_left">
                <i class="iconfont icon-duigou" id="tjf" @click="tjf1">体检费</i>
                 <br/>
               <i class="iconfont icon-duigou" id="ff" @click="ff1">氟防龋治疗</i>
              <br/>
              <i class="iconfont icon-duigou" id="sl" @click="sl1">视力检查</i>
              <br/>
              <i class="iconfont icon-duigou" id="xh" @click="xh1">血红蛋白</i>
              <br/>
              <i class="iconfont icon-duigou" id="tl" @click="tl1">听力筛查</i>
            </div>
            <div class="t_right">
              <i class="iconfont icon-duigou" id="xl" @click="xl1">心理行为筛查</i>
              <br/>
              <i class="iconfont icon-duigou" id="xq" @click="xq1">血铅</i>
              <br/>
              <i class="iconfont icon-duigou" id="yg" @click="yg1">乙肝五项</i>
              <br/>
              <i class="iconfont icon-duigou" id="xx" @click="xx1">血型(ABO+RH)</i>
            </div>
        </div>
        <div style="font-size: 0;text-align: center;padding-top: 20px">
        <el-button style="background-color: #20a0ff;color: white" @click="shenqing = false;Show(jiazhang,uname)">确 定</el-button>
        <el-button @click="shenqing = false">取 消</el-button>
        </div>
      </div>
      </div>

    </div>
    <div class="content" >
      <ul class="listhead">
        <li>学生姓名</li>
        <li>班级名称</li>
        <li>监护人姓名</li>
        <li>手机号码</li>
        <li style="text-align: center;">退费项目</li>
        <li>状态</li>
      </ul>
      <ul class="listhead font_color" v-for="(item,index) in data1">
        <li>{{item.studentName}}</li>
        <li>{{item.className}}</li>
        <li>{{item.jhrName}}</li>
        <li >{{item.phone}}</li>
        <li  class="listxm"  @mouseenter="tittle($event)" :title="tittle3">
          <span class="xian" v-for="(a) in format(item.tkxm)" >
          <span v-if="a==1">体检费 &nbsp;</span>
          <span v-else-if="a==2">氟防龋治疗 &nbsp;</span>
          <span v-else-if="a==3">视力筛查 &nbsp;</span>
          <span v-else-if="a==4">血红蛋白 &nbsp;</span>
          <span v-else-if="a==5">体力筛查 &nbsp;</span>
          <span v-else-if="a==6">心理行为筛查 &nbsp;</span>
          <span v-else-if="a==7">血铅 &nbsp;</span>
          <span v-else-if="a==8">乙肝五项 &nbsp;</span>
          <span v-else-if="a==9">血型(ABO+RH)</span>
        </span></li>
        <li v-if="item.status == 1">申请中</li>
        <li v-else-if="item.status == 2">通过</li>
        <li v-else-if="item.status == 3">驳回</li>
      </ul>
    </div>


    <!-- 分页 -->
    <div class="all">
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
    <div class="content" v-show="second">
      <div class="goschool-nav" style="line-height: 70px">
        <span style="margin-left: 5%;cursor: pointer;font-size: 25px;color: #9d9d9f" @click="fanhui" class="iconfont icon-iconfanhuishangyiji"></span>

      </div>
      <ul class="listhead">
        <li>学生姓名</li>
        <li>监护人姓名</li>
        <li>手机号码</li>
        <li>金额(元)</li>
        <li style="text-align: center">退费项目</li>
        <li>操作</li>
      </ul>
      <ul class="listhead font_color" v-for="(item,index) in data2">
        <li>{{item.studentName}}</li>
        <li>{{item.jhrName}}</li>
        <li v-if="item.phone == ''">暂无</li>
        <li v-else>{{item.phone}}</li>
        <li>{{item.tkje}}</li>
        <li class="listxm" style="" @mouseenter="tittle1($event)">
          <span class="xian" v-for="(a) in format(item.tkxm)">
           <span v-if="a==1">体检费 &nbsp;</span>
          <span v-else-if="a==2">氟防龋治疗 &nbsp;</span>
          <span v-else-if="a==3">视力筛查 &nbsp;</span>
          <span v-else-if="a==4">血红蛋白 &nbsp;</span>
          <span v-else-if="a==5">体力筛查 &nbsp;</span>
          <span v-else-if="a==6">心理行为筛查 &nbsp;</span>
          <span v-else-if="a==7">血铅 &nbsp;</span>
          <span v-else-if="a==8">乙肝五项 &nbsp;</span>
          <span v-else-if="a==9">血型(ABO+RH)</span>
        </span></li>

        <li><i class="iconfont icon-duigou" style="color: #fb8ca6;font-size: 18px;" @click="enter(item)"></i>&nbsp;
          &nbsp;&nbsp;<i class="iconfont icon-cuowu" style="color: #fb8ca6;font-size: 18px;" @click="bohui(item)"></i> </li>
      </ul>

      <!-- 分页 -->
      <div class="all">
        <span>共&nbsp;<i>{{total1}}</i>&nbsp;条</span>
        <template>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              layout="prev, pager, next"
              :total="total1"
              :page-size="5"
              v-if="total1 <= 5 ? false:true"
              @current-change="handleCurrentChange1">
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
        name: "returns",
       inject:['reload'],
        data(){
          return{
            tiaojian:false,
            shenqing:false,
            queren:false,
            first:true,
            second:false,
            third:false,
            selected:"",
            status:"",
            data1:[],
            data2:[],
             scholls:"",
             jiazhang:"",
             uname:"",
             total:"",
            total1:"",
             tjf:"", //体检费
             ff:"", //氟防龋治疗
             sl:"", //视力检查
             xh:"", //血红蛋白
             tl:"", //听力筛查
             xl:"", //心理行为筛查
             xq:"", //血铅
             yg:"", //乙肝五项
             xx:"", //血型(ABO+RH)
            tjfm:0, //体检费金额
            ffm:0, //氟防龋治疗金额
            slm:0, //视力检查金额
            xhm:0, //血红蛋白金额
            tlm:0, //听力筛查金额
            xlm:0, //心理行为筛查金额
            xqm:0, //血铅金额
            ygm:0, //乙肝五项金额
            xxm:0, //血型(ABO+RH)金额
            xianmu:0,//总退费项目
            xianmum:0,//总退费金额
             url: familyDoctor(),
            token:"",
            loginId:"",
            id:"",
            tittle3:"",
            tittle2:""
          }
        },
      created: function () {
        this.token = window.localStorage.getItem("token");
        this.loginId = window.localStorage.getItem("loginId");
        this.id = window.localStorage.getItem("id")
        this.request();
      },
      watch: {
        $route() {
          this.$router.go(0)
        },
        dialogVisible: function () {
          this.radio = ''
        }
      },
      mounted(){
       let  name  =   window.localStorage.getItem("user_name");
            if(name=="admin"){
              this.queren = true;
            }else {
              this.queren = false;
            }
      },
      methods:{
          //项目展示
          tittle(e){
             // console.log(e.target.innerText);
              this.tittle3 = e.target.innerText;
              // let li2  = document.getElementById("li2").innerText;
              // console.log(li2);
          },
           tittle1(e){
             //console.log(e.target.innerText);
             this.tittle2 = e.target.innerText;
           },
          //格式化体检项目
          format(val){
            let a = val.split(",");
            //let b = JSON.stringify(a);
           // console.log(d);
            return a ;
          },

          //数据请求
        request(){
          let _this = this;
          checkStatus(_this)
          let url=familyDoctor()
          axios.post(_this.url+"/wcfy/zytj/selectTkjls" + "?loginId="+_this.loginId+"&token="+_this.token,{
             pageSize:5,
             pageNum:1,
          }).then((response)=>{
            console.log(response);
            if(response.data.message =="暂无信息"){
              this.total = 0;
            }else{
              this.data1 = response.data.data.list;
              this.total = response.data.data.total;
            }


          })
        },
        //字符串去重复
         trimSpace(array){
    for(var i = 0 ;i<array.length;i++)
    {if(array[i] == "" || typeof(array[i]) == "undefined")
      {array.splice(i,1);
        i= i-1;}
    }
    let  aaa = array.join(",");
    this.xianmu = aaa;
    return array;
  },

          //退费申请
           Show(){
               if(this.uname == ""){
                 this.$message({
                   message:"请填写学生姓名",
                   type: 'warning'
                 });
                 return false;
               }
               if(this.jiazhang == ""){
                 this.$message({
                   message:"请填写家长姓名",
                   type: 'warning'
                 });
                 return false;
               }

               let _this = this;
               let  xianmu = this.tjf +","+this.ff+","+this.sl+","+this.xh+","+this.tl+","+this.xl+","+this.xq+","+this.yg+","+this.xx
               let  xian =  xianmu.split(",");
               this.trimSpace(xian);
               if(this.xianmu.length == 0){
                 this.$message({
                   message:"请选择退费项目",
                   type: 'warning'
                 });
                 return false;
               }
               let xianmum = this.tjfm+this.ffm+this.slm+this.xhm+this.tlm+this.xlm+this.xqm+this.ygm+this.xxm;
               //console.log(xianmum);
               checkStatus(_this);
               let url=familyDoctor();
              let schools = this.scholls; //学校名称;
              let jiazhang = this.jiazhang;//家长姓名
              let uname = this.uname;//学生姓名
              axios.post(_this.url+"/wcfy/zytj/addTkjl" + "?loginId="+_this.loginId+"&token="+_this.token,{
                stuName:uname,
                jhrName:jiazhang,
                tkxm:this.xianmu,
                tkje:xianmum
              }).then((response)=>{
                this.$message({
                  message:response.data.message,
                  type: 'warning'

                });
                 this.request();
              })
             //清除所有
                this.jiazhang = "";
                this.uname= "";
             this.tjf ="";
               this.ff="";
             this.sl="";
             this.xh="";
               this.tl="";
             this.xl="";
             this.xq="";
             this.yg="";
             this.xx="";
                let tjf = document.getElementById("tjf").removeAttribute("style");
                let ff = document.getElementById("ff").removeAttribute("style");
                let sl = document.getElementById("sl").removeAttribute("style");
             let xh = document.getElementById("xh").removeAttribute("style");
             let tl = document.getElementById("tl").removeAttribute("style");
             let xl = document.getElementById("xl").removeAttribute("style");
             let xq = document.getElementById("xq").removeAttribute("style");
             let yg = document.getElementById("yg").removeAttribute("style");
             let xx = document.getElementById("xx").removeAttribute("style");
           },
         //条件筛选
           shaixuan(){

               let _this = this;
               checkStatus(_this)
               let url=familyDoctor()
               let  select =  this.selected;

               if(select != ""){
                 if(select == "全部"){
                  this.request();
                 }else if(select == "申请中"){
                    this.status = 1;
                 }else if(select == "通过"){
                   this.status = 2;
                 }else if(select == "驳回"){
                   this.status = 3;
                 }
                 axios.post(url+"/wcfy/zytj/selectTkjls" + "?loginId="+_this.loginId+"&token="+_this.token,{
                   pageSize:5,
                   pageNum:1,
                   status:this.status
                 }).then((response)=>{
                  // console.log(response.data.message);
                   if(response.data.message == "暂无信息"){
                     this.$message({
                       message:response.data.message,
                       type: 'warning'
                     });
                   }else {
                     this.data1 = response.data.data.list;
                     this.total = response.data.data.total;
                   }

                 })
               }
           },
         //退费申请确定
          enter(obj){
            let _this = this;
            checkStatus(_this);
            let url = familyDoctor();
            let id = obj.id;
            this.$confirm("确认上述项目退费, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              axios.post(_this.url+"/wcfy/zytj/updateTjStatus" + "?loginId="+_this.loginId+"&token="+_this.token,{
                  id:id,
                  status:2
              }).then(response => {
                this.$message({
                  message:response.data.message,
                  type: 'success'
                });
                this.caozuo();
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });
            });
          },
        //驳回
         bohui(obj){
           let _this = this;
           checkStatus(_this);
           let url = familyDoctor();
           let id = obj.id;
           this.$confirm("确认驳回, 是否继续?", "提示", {
             confirmButtonText: "确定",
             cancelButtonText: "取消",
             type: "warning"
           }).then(() => {
             axios.post(_this.url+"/wcfy/zytj/updateTjStatus" + "?loginId="+_this.loginId+"&token="+_this.token,{
               id:id,
               status:3
             }).then(response => {
               this.$message({
                 message:response.data.message,
                 type: 'success'
               });
              this.caozuo();
             });
           }).catch(() => {
             this.$message({
               type: 'info',
               message: '已取消'
             });
           });
         },
        //申请操作
        caozuo(){
             this.first = false;
             this.second = true;
             let _this = this;
             checkStatus(_this)
             let url = familyDoctor();
             axios.post(url+"/wcfy/zytj/selectTkjls"+ "?loginId="+_this.loginId+"&token="+_this.token,{
               pageSize:5,
               pageNum:1,
               status:1
             }).then((response)=>{
                 console.log(response);
                 if(response.data.message == "暂无信息"){
                   this.data2 =[];
                   this.total1 = 0;
                 }else {
                   this.data2 = response.data.data.list;
                   this.total1 = response.data.data.total;
                 }

             })
        },
        // 分页
        handleCurrentChange: function (val) {
          let _this = this;
          checkStatus(_this);
          let url = familyDoctor();
           if(this.selected  == "全部" ||this.selected == "") {
             axios.post(url + "/wcfy/zytj/selectTkjls" + "?loginId=" + _this.loginId + "&token=" + _this.token,
               {
                 pageNum: val,
                 pageSize: 5,
               }).then(function (response) {
               _this.data1 = response.data.data.list
               _this.total = response.data.data.total
             })
             return false;
           }else if(this.selected == "申请中"){
            this.status = 1;
          }else if(this.selected == "通过"){
            this.status = 2;
          }else if(this.selected == "驳回"){
            this.status = 3;
          }
            axios.post(url + "/wcfy/zytj/selectTkjls" + "?loginId=" + _this.loginId + "&token=" + _this.token,
              {
                pageNum: val,
                pageSize: 5,
                status:this.status
              }).then(function (response) {
              _this.data1 = response.data.data.list;
              _this.total = response.data.data.total;
            })


        },
        handleCurrentChange1(val){
          let _this = this;
          checkStatus(_this)
          let url = familyDoctor()
          axios.post(url + "/wcfy/zytj/selectTkjls" + "?loginId=" + _this.loginId + "&token=" + _this.token,
            {
              pageNum: val,
              pageSize: 5,
              status:1
            }).then(function (response) {

            _this.data2 = response.data.data.list
            _this.total1 = response.data.data.total
          })
        },
        //返回
        fanhui(){
          this.first = true;
          this.second = false;
          this.request();
        },
        fanhui2(){
          this.third = false;
          this.first = true;
        },
        //选择退费项
         tjf1(){
            let tjf = document.getElementById("tjf");
            let tjfc = tjf.getAttribute("style");
           if(tjfc == null){
             tjf.setAttribute("style","color:#fb8ca6");
             this.tjf = "1";
             this.tjfm =8;
           }else {
             tjf.removeAttribute("style");
             this.tjf = "";
             this.tjfm = 0;
           }
         },
        //氟防龋治疗
        ff1(){
          let ff = document.getElementById("ff");
          let ffc = ff.getAttribute("style");
          if(ffc == null){
            ff.setAttribute("style","color:#fb8ca6");
            this.ff = "2";
            this.ffm = 9;
          }else {
            ff.removeAttribute("style");
            this.ff = "";
            this.ffm = 0;
          }
        },
        //视力检查
        sl1(){
          let sl = document.getElementById("sl");
          let slc = sl.getAttribute("style");
          if(slc == null){
            sl.setAttribute("style","color:#fb8ca6");
            this.sl = "3"
            this.slm = 26;
          }else {
            sl.removeAttribute("style");
            this.sl = "";
            this.slm = 0;
          }
        },
        //血红蛋白
        xh1(){
          let xh = document.getElementById("xh");
          let xhc = xh.getAttribute("style");
          if(xhc == null){
            xh.setAttribute("style","color:#fb8ca6");
            this.xh = "4"
            this.xhm = 2;
          }else {
            xh.removeAttribute("style");
            this.xh = "";
            this.xhm = 0;
          }
        },
        //听力筛查
        tl1(){
          let tl = document.getElementById("tl");
          let tlc = tl.getAttribute("style");
          if(tlc == null){
            tl.setAttribute("style","color:#fb8ca6");
            this.tl = "5";
            this.tlm = 18;
          }else {
            tl.removeAttribute("style");
            this.tl = "";
            this.tlm = 0;
          }
        },
        //心理行为筛查
        xl1(){
          let xl = document.getElementById("xl");
          let xlc = xl.getAttribute("style");
          if(xlc == null){
            xl.setAttribute("style","color:#fb8ca6");
            this.xl = "6";
            this.xlm = 26;
          }else {
            xl.removeAttribute("style");
            this.xl = "";
            this.xlm = 0;
          }
        },
        //血铅
        xq1(){
          let xq = document.getElementById("xq");
          let xqc = xq.getAttribute("style");
          if(xqc == null){
            xq.setAttribute("style","color:#fb8ca6");
            this.xq = "7";
            this.xqm = 25;
          }else {
            xq.removeAttribute("style");
            this.xq = "";
            this.xqm = 0;
          }
        },
        //乙肝五项
        yg1(){
          let yg = document.getElementById("yg");
          let ygc = yg.getAttribute("style");
          if(ygc == null){
            yg.setAttribute("style","color:#fb8ca6");
            this.yg = "8";
            this.ygm = 25;
          }else {
            yg.removeAttribute("style");
            this.yg = "";
            this.ygm = 0;
          }
        },
        //血型(ABO+RH)
        xx1(){
          let xx = document.getElementById("xx");
          let xxc = xx.getAttribute("style");
          if(xxc == null){
            xx.setAttribute("style","color:#fb8ca6");
            this.xx = "9";
            this.xxm = 24;
          }else {
            xx.removeAttribute("style");
            this.xx = "";
            this.xxm = 0;
          }
        },
      }
    }
</script>

<style scoped>
   .shaixuan{background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 20px;}
   .shenqing{background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 20px;}
   .queren{background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 75%;}
   .icon-duigou{font-size: 15px;cursor: pointer;}
   .icon-cuowu{font-size: 15px;cursor: pointer;}
   .xian{word-break:normal;white-space: pre-wrap;word-wrapL:break-word;padding: 0;margin: 0; -webkit-margin-before: 0;
   -webkit-margin-after: 0;display: inline-block;}
   .listxm{line-height: 70px;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align: center;}
   .tjfc{color: #fb8ca6;}
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
   .test li {
     float: left;
     height: 70px;
     line-height: 70px;
     text-align: center;
     white-space: nowrap;
     font-size: 14px;
     /*color: #fb8ca6;*/
     background-color: #ffffff;
     margin-right: 0.2%;
   }

   .test li:nth-of-type(1) {
     width: 10%;
     color: #fb8ca6;
   }

   .test li:nth-of-type(2) {
     width: 9%;
   }

   .test li:nth-of-type(3) {
     width: 10%;
   }

   .test li:nth-of-type(4) {
     width: 9%;
   }

   .test li:nth-of-type(5) {
     width: 9%;
   }

   .test li:nth-of-type(6) {
     width: 9%;
   }

   .test li:nth-of-type(7) {
     width: 12%;
   }

   .test li:nth-of-type(8) {
     width: 9%;
   }

   .test li:nth-of-type(9) {
     width: 9%;
   }

   .test li:nth-of-type(10) {
     width: 12%;
   }

   .zengzhi1{height: 25px;line-height: 25px;border-bottom: 1px solid #fb8ca6;}
  .zengzhi2{height: 25px;line-height: 24px;}
  .zengzhi3{line-height: 50px}
  .zz{display: block;float: left;width: 24%;border-right: 1px solid #fb8ca6;}
  .zz1{display: block;float: left;width: 28%;border-right: 1px solid #fb8ca6;}
  .zz2{display: block;float: left;width: 23%;}

  .miandiv{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 2001;}
  .miandiv1{background-color: rgba(150, 152, 150,0.8);position: fixed;top: 0;left: 0;right:0;bottom: 0;    overflow: auto;margin: 0;z-index: 4001;}
  .contantdiv{position: absolute;top: 15%;width: 22%;left: 50%;transform: translateX(-50%);background: #fff;
    border-radius: 2px;box-shadow: 0 1px 3px rgba(0,0,0,.3);box-sizing: border-box;margin-bottom: 50px;padding: 10px;font-size: 16px;}
  .ptittle{text-align: center;height: 30px;border-bottom: 1px solid #969896;margin-bottom: 20px;}
   .contantdiv1{position: absolute;top: 2%;height: 600px;left: 50%;transform: translateX(-50%);}
   .t_left{width: 50%;padding-left: 18px;font-size: 15px;}
   .t_right{width: 50%;font-size: 15px;}
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
    width: 15%;
    text-align: center;
  }
  .listhead li:nth-of-type(2){
    width: 15%;
    text-align: center;
  }
  .listhead li:nth-of-type(3){
    width: 15%;
    text-align: center;
  }
  .listhead li:nth-of-type(4){
    width: 15%;
    text-align: center;
  }
  .listhead li:nth-of-type(5){
    width: 24%;

  }
  /*.listhead li:nth-of-type(6){*/
  /*width: 15%;*/
  /*}*/
  .listhead li:nth-of-type(6){
    width: 15%;
    margin-right:0;
    text-align: center;
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
