<template>
    <div class="contents">
        <div class="head_navs">
            <div class="btn_tj">班级详情</div>
            <div class="search-Input">
               <div>
                   <p>总人数</p>
                   <span>{{num}}</span>
               </div>
                <div>
                    <p>班级数</p>
                    <span>{{total}}</span>
                </div>
            </div>

            <div class="new_add">
                <span @click="bac=true">新增班级</span>
            </div>
        </div>
        <div class="lists" v-for="(item,index) in data_list">
            <div class="top">
              <div class="top_left">
              <span class="top_banji">{{item.className}}</span> <span class="top_rs">{{item.actualNum}}/{{item.reservedNum}}</span> <span class="top_sj">{{item.studyTime}}</span>
              </div>
              <div class="top_right">
              <span class="teacher">{{item.teacherName}}</span> <span class="fenge" v-if="item.teacherName != ''">|</span> <span class="jiaoshi">{{item.studyRoom}}</span>
              <span class="bianji" @click="show_bj(item)">编辑</span> <span class="jieke" @click="jieke(item)">结课 </span></div>
            </div>
            <div style="display: inline-block;margin-right: 10px" v-for="(items,index) in item.orders" >
            <div class="bottom" >
                 <div class="bot_list"  v-if="items.orderStatus == 5 ">
                     <span class="iconfont icon-fangxiang_jiantou_"  @click="zhuan(items)"></span>
                     <span class="bot_name">{{items.babyName}}</span>
                     <span class="bot_sj">{{items.payDate}}</span>
                 </div>
                <div class="bot_list1"   v-else-if=" items.orderStatus == 4">
                <span class="bot_name">{{items.babyName}}</span>
                <span class="bot_sj1">待购买</span>
                </div>
              <div class="bot_list1" v-else-if=" items.orderStatus == 3">
                <span class="bot_name">{{items.babyName}}</span>
                <span class="bot_sj1">试听</span>
              </div>
                <div class="bot_list1" v-else-if="items.orderStatus ==  2">
                <span class="bot_name">待购买</span>
                  <span class="bot_sj1"></span>
                </div>
            </div>
            </div>



        </div>
      <!--转班-->
      <div class="bac" v-show="bac0" >
        <div class="con" >
          <span class="tit">变更班级</span>
          <div class="con1">
            <div v-for="(item,index) in data5">
              <div>
              <span class="tits">{{item.gradeName}}</span>
              <div class="classroom">
                <span :class="inx == (items.id) ? 'classname1':'classname'"  v-for="(items,index) in item.etzjClassList" @click="zhuanban(items)">{{items.className}}</span>
              </div>
              </div>
            </div>

          </div>
          <span  class="foot">
             <el-button @click="bac0 = false">取 消</el-button>
             <el-button type="primary" @click="yaoqing">确 定</el-button>
            </span>
        </div>
      </div>
      <!--新增-->
      <div class="bac" v-show="bac" >
        <div class="con" >
            <span class="tit">新增班级</span>
            <span class="tits">班级人数</span>
            <el-input class="shuru" v-model="bjrs"   type="number"></el-input>
            <span class="tits">老师姓名</span>
            <el-input  class="shuru" v-model="lsxm"></el-input>
            <span class="tits">上课教室</span>
            <el-input  class="shuru" v-model="skjs"></el-input>
            <span class="tits">上课时间</span>
            <p></p>
          <el-time-select
            style="width: 152px;margin-left: 25px"
            placeholder="起始时间"
            v-model="startTime"
            :picker-options="{
      start: '08:30',
      step: '00:10',
      end: '18:30'
    }">
          </el-time-select>
          <el-time-select
            style="width: 152px;"
            placeholder="结束时间"
            v-model="endTime"
            :picker-options="{
      start: '08:30',
      step: '00:10',
      end: '18:30',
      minTime: startTime
    }">
          </el-time-select>

            <span  class="foot">
             <el-button @click="bac = false">取 消</el-button>
             <el-button type="primary" @click="xinzeng()">确 定</el-button>
            </span>
        </div>
        </div>
      <!--编辑-->
      <div class="bac" v-show="bac1" >
        <div class="con" >
          <span class="tit">编辑班级</span>
          <span class="tits">班级人数</span>
          <el-input class="shuru" v-model="bjrs1"></el-input>
          <span class="tits">老师姓名</span>
          <el-input  class="shuru" v-model="lsxm1"></el-input>
          <span class="tits">上课教室</span>
          <el-input  class="shuru" v-model="skjs1"></el-input>
          <span class="tits">上课时间</span>
          <p></p>
          <el-time-select
            style="width: 152px;margin-left: 25px"
            placeholder="起始时间"
            v-model="startTime1"
            :picker-options="{
      start: '08:30',
      step: '00:10',
      end: '18:30'
    }">
          </el-time-select>
          <el-time-select
            style="width: 152px;"
            placeholder="结束时间"
            v-model="endTime1"
            :picker-options="{
      start: '08:30',
      step: '00:10',
      end: '18:30',
      minTime: startTime1
    }">
          </el-time-select>
          <span  class="foot">
             <el-button @click="bac1 = false">取 消</el-button>
             <el-button type="primary" @click="bianji()">确 定</el-button>
            </span>
        </div>
      </div>
    </div>
</template>

<script>
    import axios from "axios"
    import {getLastDate,familyDoctor} from "./../../common/util.js"
    export default {
        name: "list5",
        data(){
            return{
                data_list:"",
                total:'',
                dialogVisible:false,
                dialogVisibles:false,
                input:"",
                inputs:"",
                num:"",
                id:"",
                bac0:false,
                bac:false,
                bac1:false,
                bjrs:"",
                lsxm:"",
                sksj:"",
                skjs:"",
                bjrs1:"",
                lsxm1:"",
                sksj1:"",
                skjs1:"",
                url:familyDoctor(),
                token:"",
                loginId:"",
                startTime:"",
                endTime:"",
                startTime1:"",
                endTime1:"",
                classId:"",
                data5:"",
                njId:"",
                bjId:"",
                ddId:"",
                inx:""
            }
        },
        created(){
            this.token = window.localStorage.getItem("token");
            this.loginId = window.localStorage.getItem("loginId");
            this.requestData(window.localStorage.getItem('gradeId'))
            this.num=window.localStorage.getItem('stuNum');
            this.total=window.localStorage.getItem('classNum');
        },
        methods:{
            requestData(id){
                var that=this
                axios.post(that.url+"/wcfy/sys/class/classList"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                      gradeId:id,
                    }).then(function(response){
                      console.log(response)
                    that.data_list=response.data.data;
                   that.total=  response.data.data.length
                   that.num= response.data.totalNum

                })
            },
            sure_add(){
                var that=this
                axios.post(that.url+"/wcfy/sys/class/saveNewClass"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        gradeId:window.localStorage.getItem('gradeId'),
                        classNum:that.input,
                        ylClassNum:that.inputs
                    }).then(function(response){
                      if(response.data.code==500){
                          that.$message({
                              type:'error',
                              message:response.data.msg
                          })
                      }else{
                          that.$message({
                              type:'success',
                              message:response.data.msg
                          })
                          that.input=''
                          that.inputs=''
                          that.requestData(window.localStorage.getItem('gradeId'))
                      }
                })
            },
            //编辑
            sure_edit(xxClassNum){
                var that=this

                axios.post(that.url+"/wcfy/sys/class/updateEtzjClassInfo"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        gradeId:window.localStorage.getItem('gradeId'),
                        classId:that.id,
                        xsNum:that.input,
                        xxNum:that.inputs
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.$message({
                            type:'success',
                            message:response.data.msg
                        })
                        that.input=''
                        that.inputs=''
                        that.requestData(window.localStorage.getItem('gradeId'))
                    }
                })
            },
            total_edit(id,xxClassNum,classTotalNum){
                var that=this
                that.id=id
                that.input=classTotalNum-xxClassNum
            },
            //删除
            total_detel(id){
                var that=this
                axios.post(that.url+"/wcfy/sys/class/deleteEtzjClass"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        gradeId:window.localStorage.getItem('gradeId'),
                        classId:id,
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.$message({
                            type:'success',
                            message:response.data.msg
                        })
                        that.requestData(window.localStorage.getItem('gradeId'))
                    }
                })
            },
            //新增
            xinzeng(){
              let that=this;
              if(that.bjrs == ""){
                 this.$message({
                   type:"error",
                   message:"班级人数不能为空或只能为数字"
                 })
                 return false;
              }
              if(  that.bjrs <= 0  || that.bjrs > 15){
                this.$message({
                  type:"error",
                  message:"班级人数不能小于0个或者大于15个"
                })
                return false;
              }
              if(that.lsxm == ""){
                this.$message({
                  type:"error",
                  message:"班级老师不能为空"
                })
                return false;
              }
              if(that.skjs == ""){
                this.$message({
                  type:"error",
                  message:"班级教室不能为空"
                })
                return false;
              }
              if(that.startTime == "" || that.endTime == ""){
                this.$message({
                  type:"error",
                  message:"班级开课时间不能为空"
                })
                return false;
              }
              let studyTime = this.startTime + "-" + this.endTime;
              axios.post(that.url+"/wcfy/sys/class/saveNewClass"+"?loginId="+that.loginId+"&token="+that.token,
                {
                  gradeId:window.localStorage.getItem('gradeId'),
                  classNum:that.bjrs,
                  teacherName:that.lsxm,
                  studyRoom:that.skjs,
                  studyTime:studyTime
                }).then(function(response){
                  console.log(response)
                if(response.data.code==500){
                  that.$message({
                    type:'error',
                    message:response.data.msg
                  })
                }else{
                  that.$message({
                    type:'success',
                    message:response.data.msg
                  })
                  that.bjrs='';
                  that.skjs='';
                  that.sksj='';
                  that.lsxm='';
                  that.startTime = "";
                  that.endTime = "";
                  that.bac = false;
                  that.requestData(window.localStorage.getItem('gradeId'))
                }
              })
            },

            //编辑
            show_bj(obj){
              console.log(obj);
              this.bac1 = true;
              this.skjs1= obj.studyRoom;
              this.lsxm1 = obj.teacherName;
              this.classId = obj.classId;
              this.bjrs1 = obj.reservedNum;
              let time = obj.studyTime;

              this.startTime1 = time.substr(0,5);
              this.endTime1 = time.substr(6,11)
            },
            bianji(){
              var that=this
              if(that.bjrs1 == ""){
                this.$message({
                  type:"error",
                  message:"班级人数不能为空或只能为数字"
                })
                return false;
              }
              if(  that.bjrs1 <= 0  || that.bjrs1 > 15){
                this.$message({
                  type:"error",
                  message:"班级人数不能小于0个或者大于15个"
                })
                return false;
              }
              if(that.lsxm1 == ""){
                this.$message({
                  type:"error",
                  message:"班级老师不能为空"
                })
                return false;
              }
              if(that.skjs1 == ""){
                this.$message({
                  type:"error",
                  message:"班级教室不能为空"
                })
                return false;
              }
              if(that.startTime1 == "" || that.endTime1 == ""){
                this.$message({
                  type:"error",
                  message:"班级开课时间不能为空"
                })
                return false;
              }
                let studyTime = this.startTime1 + "-" + this.endTime1;
              console.log(that.classId)
              axios.post(that.url+"/wcfy/sys/class/updateEtzjClassInfo"+"?loginId="+that.loginId+"&token="+that.token,
                {
                  classNum:that.bjrs1,
                  teacherName:that.lsxm1,
                  studyRoom:that.skjs1,
                  studyTime:studyTime,
                  classId:that.classId
                }).then(function(response){
                  console.log(response)
                if(response.data.code==500){
                  that.$message({
                    type:'error',
                    message:response.data.msg
                  })
                }else{
                  that.$message({
                    type:'success',
                    message:response.data.msg
                  })
                  that.bac1 = false;
                  that.input=''
                  that.inputs=''
                  that.requestData(window.localStorage.getItem('gradeId'))
                }
              })
            },
            //结课
            jieke(obj){
              console.log(obj)
              let classId = obj.classId;
              this.$confirm('确定结束此班级的课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var that=this
                axios.post(that.url+"/wcfy/sys/class/closeClass"+"?loginId="+that.loginId+"&token="+that.token,
                  {
                    classId:classId
                  }).then(function(response){
                  if(response.data.code==500){
                    that.$message({
                      type:'error',
                      message:response.data.msg
                    })
                  }else{
                    that.$message({
                      type:'success',
                      message:response.data.msg
                    })
                    that.bac = false;
                    that.requestData(window.localStorage.getItem('gradeId'))
                  }
                })

              })
            },
            //查看转班
            zhuan(obj){
              this.bac0 = true;
              let that = this;
               this.ddId = obj.id;
              axios.post(that.url+"/wcfy/sys/order/loadGradeClassList"+"?loginId="+that.loginId+"&token="+that.token,
                {
                }).then(function(response){
                 that.data5 = response.data.list;
                 console.log(that.data5)
              })
            },
            //转班
            zhuanban(obj) {
              this.inx = obj.id;
              console.log(this.inx)
              this.njId = obj.gradeId;
              this.bjId = obj.id;

            },
          //邀请
          yaoqing(){
            this.$confirm('确定同意此条信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var that=this
              axios.post(that.url+"/wcfy/sys/order/changeClass"+"?loginId="+that.loginId+"&token="+that.token,
                {
                  orderId:that.ddId,
                  gradeId:that.njId,
                  classId:that.bjId
                }).then(function(response){
                console.log(response)
                if(response.data.code==500){
                  that.$message({
                    type:'error',
                    message:response.data.msg
                  })
                }else{
                  that.$message({
                    type:'success',
                    message:response.data.msg
                  })
                  that.bac0 = false;
                  that.requestData(window.localStorage.getItem('gradeId'));
                }
              })

            })
          }
        }
    }
</script>

<style scoped>
    .contents{
        background-color: #fff;
        padding:0 30px 30px;
    }
    .head_navs{
        height: 70px;
        background-color: #fff;
        position: relative;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #bbb;
    }
    .btn_tj{
        font-size: 22px;
        letter-spacing: 1px;
        color: #fb8ca6;
        margin-right: 40px;
    }
    .search-Input{
        display: flex;
    }
    .search-Input>div{
        display: flex;
        align-items: baseline;
        width: 100px;
        margin-right: 20px;
    }
    .search-Input>div:nth-of-type(1){
        border-right: 1px solid #bbb;
    }
    .search-Input p{
        font-size: 14px;
        color: #888;
        margin-right: 20px;
    }
    .search-Input span{
        color: #fb8ca6;
        font-size: 18px;
    }
    .new_add{
        width: 125px;
        height: 40px;
        background-color: #fb8ca6;
        border-radius: 5px;
        border: solid 1px #fb8ca6;
        text-align: center;
        position: absolute;
        right: 0px;
        cursor: pointer;
    }
    .new_add span{
        line-height: 40px;
        color: white;
        font-size: 18px;
    }
    /*.lists>div{*/
        /*font-size: 16px;*/
        /*padding-bottom: 20px;*/
        /*border-bottom: 1px solid #bbb;*/
    /*}*/
    /*.lists>div>div{*/
        /*height: 70px;*/
        /*display: flex;*/
        /*align-items: center;*/
    /*}*/
    /*.lists>div>div>span{*/
        /*margin-right: 15px;*/
    /*}*/
    /*.lists>div>div>span:nth-of-type(2){*/
        /*margin-right: 0px;*/
    /*}*/
    .total_edit{
        color:#fb8ca6;
        cursor: pointer;
    }
    .total_detel{
        color: #fb8ca6;
        cursor: pointer;
    }
    .lists ul{
        display: flex;
        width: 100%;
    }
    .lists ul li{
        width: 18%;
        margin-right: 1%;
        height: 120px;
        background-color: #ffe7ed;
        border-radius: 10px;
        border: solid 1px #fb8ca6;
    }
    .name{
        font-size: 30px;
        font-weight: bold;
        text-align: center;
        color: #fb8ca6;
        letter-spacing: 1px;
        height: 80px;
        line-height: 80px;
    }
    .date{
        text-align: center;
        color: #888888;
    }
    .new_add_class p{
        width:80px;
    }
    .top{
      width: 100%;
      display: flex;
      align-items: center;
      height: 75px;
    }
    .top_left{
      text-align: left;
      width: 50%;
    }
    .top_right{
      text-align: right;
      width: 50%;
    }
    .top_banji{
      font-size: 16px;
      color: #333333;
      display: inline-block;
      width: 140px;
    }
    .top_rs{
      font-size: 16px;
      color: #333333;
      margin-left: 18px;
      display: inline-block;
      width: 30px;
    }
    .top_sj{
      font-size: 14px;
      color: #333333;
      opacity: 0.5;
      margin-left: 32px;
    }
    .teacher{
      font-size: 18px;
      color: #fb8ca6;
      margin-right: 15px;
    }
    .fenge{
      color: #fb8ca6;
      margin-right: 9px;
    }
    .jiaoshi{
      font-size: 18px;
      color: #fb8ca6;
      margin-right: 22px;
    }
    .bianji{
      display: inline-block;
      width: 71px;
      height: 41px;
      text-align: center;
      line-height: 41px;
      font-size: 16px;
      color: #ffffff;
      border: 1px solid #fb8ca6;
      background-color: #fb8ca6;
      margin-right: 15px;
      border-radius: 6px;
      cursor: pointer;
    }
    .jieke{
      display: inline-block;
      width: 71px;
      height: 41px;
      text-align: center;
      line-height: 41px;
      font-size: 16px;
      color: #bbbbbb;
      border: 1px solid #bbbbbb;
      border-radius: 6px;
      cursor: pointer;
    }
    .bottom{
      display: flex;
    }
    .bottom  div:nth-child(2){
       margin-left: 10px;
    }
    .bottom  div:nth-child(3){
      margin-left: 10px;
    }
    .bottom  div:nth-child(4){
      margin-left: 10px;
    }
    .bottom  div:nth-child(5){
      margin-left: 10px;
    }
    .bot_list{
        width: 156px;
        height: 140px;
        display: inline-block;
        background-color: #ffd0de;
        border: 1px solid #fb8ca6;
        border-radius: 10px;
        margin-top: 10px;
        position: relative;
      }
    .bot_list1{
      width: 156px;
      height: 140px;
      display: inline-block;
      background-color: #ffffff;
      border: 1px solid #fb8ca6;
      border-radius: 10px;
      margin-top: 10px;
    }
   .bot_name{
     width: 100%;
     height: 100px;
     line-height: 100px;
     font-size: 30px;
     font-weight: bold;
     color: #fb8ca6;
     display: inline-block;
     text-align: center;
   }
    .bot_name1{
      width: 100%;
      height: 140px;
      line-height: 140px;
      font-size: 30px;
      font-weight: bold;
      color: #fb8ca6;
      display: inline-block;
      text-align: center;
    }
   .bot_sj{
     width: 100%;
     display: inline-block;
     text-align: center;
     font-size: 18px;
     color: #888888;
   }
   .bot_sj1{
     width: 100%;
     display: inline-block;
     text-align: center;
     font-size: 18px;
     color: #fb8ca6;
   }
  .bac{
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    overflow: auto;
    margin: 0;
    z-index: 20;
    background-color: rgba(0,0,0,0.4);
  }
  .con{
    margin:0 auto;
    width: 375px;
    background-color: #ffffff;
    margin-top: 8%;
    border-radius: 10px;
    padding: 0 30px;
  }
  .con1{
    height: 350px;
    overflow: auto;
  }
  .tit{
    height: 58px;
    line-height: 58px;
    border-bottom: 1px solid #dcdcdc;
    font-size: 18px;
    color: #fb8ca6;
    display: inline-block;
    width: 100%;
  }
  .tits{
    font-size: 16px;
    color: #6a6a6a;
    margin-bottom: 12px;
    display: inline-block;
    margin-left: 25px;
    margin-top: 12px;
  }
  .shuru{
    margin-left: 25px;
    width: 310px;
  }
  .foot{
    display: inline-block;
    height: 80px;
    line-height: 80px;
    width: 100%;
    text-align: center;
  }
  .classroom{
    padding: 0 25px;
  }
  .classname{
    color: #fb8ca6;
    display: inline-block;
    width:  95px;
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #fb8ca6;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;
  }
    .icon-fangxiang_jiantou_{
    position: absolute;
    right: 8px;
    top: 8px;
    color: white;
    cursor: pointer;
  }
  .classname1{
    background-color: #fb8ca6;
    color: #000000;
    display: inline-block;
    width:  95px;
    font-size: 15px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #fb8ca6;
    margin-right: 5px;
    margin-top: 5px;
    cursor: pointer;
  }
</style>
