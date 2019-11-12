<template>
    <div class="contents">
        <div class="head_navs">
            <div class="btn_tj" @click="dialogVisible = true">条件搜索</div>
            <div class="search-Input">
                <input type="text" placeholder="宝宝姓名/手机号" v-model="search">
            </div>
            <div class="search-icon" @click="Serach()">
                <img src="../../assets/images/search.png" height="30" width="30">
            </div>
        </div>

        <div class="content">
            <ul class="listhead">
                <li>姓名</li>
                <li>年龄</li>
                <li>监护人</li>
                <li>手机号码</li>
                <li>预约课程</li>
                <li>班级月龄</li>
                <li>排队名次</li>
                <li>状态</li>
                <li>操作</li>
            </ul>
            <ul class="listhead font_color" v-for="(item,index) in data3">
                <li>{{item.babyName}}</li>
                <li>{{item.babyAge}}岁</li>
                <li>{{item.guardianName}}</li>
                <li>{{item.guardianPhone}}</li>
                <li>{{item.gradeName}}</li>
                <li>{{item.monthAge}}</li>
                <li>{{item.queuedNum}}</li>
                <li>排队中</li>
                <!--<li v-if="item.orderStatus==1">已预约</li>-->
                <!--<li v-else-if="item.orderStatus==2">排队中</li>-->
                <!--<li v-else-if="item.orderStatus==3">已取消</li>-->
                <!--<li v-else-if="item.orderStatus==4">待支付</li>-->
                <!--<li v-else-if="item.orderStatus==5">服务中</li>-->
                <!--<li v-else="item.orderStatus==6">已完成</li>-->
                <li>
                  <span @click="zhuan(item)" style="color: #63a35c;cursor: pointer;">邀请试听</span>
                </li>
            </ul>
        </div>

        <div class="all">
            <span>共&nbsp;<i>{{total}}</i>&nbsp;条</span>

            <!-- 分页 -->
            <template>
                <div class="block" id="signlist1">
                    <el-pagination
                            layout="prev, pager, next"
                            :total="total"
                            :page-size="10"
                            v-if="total <= 10 ? false:true"
                            @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </template>
        </div>
        <!--邀请试听-->
      <div class="bac" v-show="bac0" >
        <div class="con" >
          <span class="tit">变更班级</span>
          <div class="con1">
            <div v-for="(item,index) in data5">
              <div>
                <span class="tits">{{item.gradeName}}</span>
                <div class="classroom">
                  <span   :class="inx == (items.id) ? 'classname1':'classname'"    v-for="(items,index) in item.etzjClassList" @click="tongyi(items,index)"  >{{items.className}}</span>
                </div>
              </div>
            </div>

          </div>
          <span class="tits">试听时间</span>
          <div class="block">
            <el-date-picker
              v-model="stsj"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <span  class="foot">
             <el-button @click="bac0 = false">取 消</el-button>
             <el-button type="primary" @click="yaoqing">确 定</el-button>
            </span>
        </div>


      </div>
        <!--条件搜索-->
        <div class="xf_search">
            <el-dialog
                    title="条件搜索"
                    :visible.sync="dialogVisible"
                    width="30%"
                    >
                <div class="xf_content">
                    <div>
                        <p>课程</p>
                        <el-select   @change="req_nianlin" v-model="selectvalue_kc" placeholder="请选择">
                            <el-option
                              v-for="item in options_kc"
                              :key="item.gradeName"
                              :label="item.gradeName"
                              :value="item.gradeId">
                            </el-option>
                        </el-select>
                    </div>
                  <div>
                    <p>宝宝月龄</p>
                    <el-select v-model="selectvalue_status" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="dialogVisible = false,select_search()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import {getLastDate,familyDoctor} from "./../../common/util.js"
    export default {
        name: "lits3",
        data() {
            return {
                total: 0,
                url:familyDoctor(),
                id: "",
                token: "",
                loginId: "",
                search: "",
                startDate: "",
                endDate: "",
                data3: [],
                dialogVisible: false,
                options: [],
                selectvalue_status: '',
                selectvalue_kc:"",
                options_kc: [
                  {
                    value: '1',
                    label: '早教课A班'
                }, {
                    value: '2',
                    label: '早教课B班'
                }, {
                    value: '3',
                    label: '早教课C班'
                }, {
                    value: '4',
                    label: '早教课D班'
                }, {
                    value: '5',
                    label: '早教课E班'
                },{
                    value: '6',
                    label: '早教课蒙氏班'
                }],
                bac0:"",
                data5:"",
                ddId:"",
                njId:"",
                bjId:"",
                inx:0,
                isActive:-1,
                stsj:""
            };
        },
        created(){
          this.token = window.localStorage.getItem("token");
          this.loginId = window.localStorage.getItem("loginId");
          this.req_banji();
          this.requestData();
        },
        methods:{
            handleCurrentChange(val){
                var that=this
                if(that.selectvalue_status!=''||that.selectvalue_kc!=''){
                  let monthAge = (that.selectvalue_status).substr(0,5);
                    axios.post(that.url+"/wcfy/sys/order/loadAppointmentList"+"?loginId="+that.loginId+"&token="+that.token,
                        {
                            pageNum:val,
                            pageSize:10,
                            orderStatus:"1",
                            monthAge:monthAge,
                            gradeId:that.selectvalue_kc
                        }).then(function(response){
                        if(response.data.code==500){
                            that.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }else{
                            that.data3=response.data.appointmentList
                            that.total=response.data.total
                        }
                    })
                }else{
                    axios.post(that.url+"/wcfy/sys/order/loadAppointmentList"+"?loginId="+that.loginId+"&token="+that.token,
                        {
                            pageNum:val,
                            pageSize:10,
                            orderStatus:"1"
                        }).then(function(response){

                        if(response.data.code==500){
                            that.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }else{
                            that.data3=response.data.appointmentList
                            that.total=response.data.total
                        }
                    })
                }

            },
            requestData(){
                var that=this
                axios.post(that.url+"/wcfy/sys/order/loadAppointmentList"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:1,
                        pageSize:10,
                        orderStatus:"1"
                    }).then(function(response){
                      console.log(response)
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.data3=response.data.appointmentList
                        that.total=response.data.total
                    }
                })
            },
            //搜索
            Serach(){
                var that=this
                axios.post(that.url+"/wcfy/sys/order/loadAppointmentList"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:1,
                        pageSize:10,
                        searchKey:that.search,
                        orderStatus:"1"
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.data3=response.data.appointmentList
                        that.total=response.data.total
                    }
                })
            },
            select_search(){
                var that=this
              let monthAge ;
              if(that.selectvalue_status != ""){
                monthAge = (that.selectvalue_status).substr(0,5);
              }

                axios.post(that.url+"/wcfy/sys/order/loadAppointmentList"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:1,
                        pageSize:10,
                        orderStatus:"1",
                        gradeId:that.selectvalue_kc,
                        monthAge:monthAge
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.data3=response.data.appointmentList
                        that.total=response.data.total
                    }
                })
            },
           //同意样式以及年纪班级id
            tongyi(obj,dev){
              this.inx = obj.id;
              this.njId = obj.gradeId;
              this.bjId = obj.id;
            },
          //请求查询条件
          req_banji(){
            let that = this;
            axios.post(that.url+"/wcfy/sys/grade/loadGradeList"+"?loginId="+that.loginId+"&token="+that.token,
              {
                pageNum:1,
                pageSize:10
              }).then(function(response){
              console.log(response)
              if(response.data.code==500){
                that.$message({
                  type:'error',
                  message:response.data.msg
                })
              }else{
                that.options_kc = response.data.list;
                // that.total=response.data.page.total;
              }
            })
          },
          req_nianlin(){
            let that = this;
            that.selectvalue_status = "";
            axios.post(that.url+"/wcfy/sys/class/loadBabyMonthAge"+"?loginId="+that.loginId+"&token="+that.token,
              {
                gradeId:that.selectvalue_kc
              }).then(function(response){
              console.log(response)
              if(response.data.code==500){
                that.$message({
                  type:'error',
                  message:response.data.msg
                })
              }else{
                that.options =response.data.monthAgeList;
                // that.total=response.data.page.total;
              }
            })
          },
          //请求班级
          zhuan(obj){
            this.bac0 = true;
            let that = this;
            console.log(obj)
            that.ddId = obj.id;
            axios.post(that.url+"/wcfy/sys/order/loadGradeClassList"+"?loginId="+that.loginId+"&token="+that.token,
              {
              }).then(function(response){
              that.data5 = response.data.list;
              console.log(that.data5)
            })
          },
          //邀请
          yaoqing(){
            if(this.stsj == ""){
               this.$message({
                 type:"error",
                 message:"请选择试听时间"
               })
              return false
            }
            if(!this.bjId){
              this.$message({
                type:"error",
                message:"请选择试听的班级"
              })
              return false
            }
            this.$confirm('确定同意此条信息, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var that=this
              axios.post(that.url+"/wcfy/sys/order/changeClass"+"?loginId="+that.loginId+"&token="+that.token,
                {
                  orderId:that.ddId,
                  orderStatus:"3",
                  gradeId:that.njId,
                  classId:that.bjId,
                  auditionDate:that.stsj
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
                  that.input='';
                  that.inputs='';
                  that.requestData();
                }
              })

            })
          }
        },
        computed:{
          tongyi1(obj,ind){
            console.log(obj)
            console.log(ind)
            this.isActive=index;
          }
        }
    }
</script>

<style scoped>
.head_navs{
    height: 70px;
    background-color: #fff;
    position: relative;
    display: flex;
    align-items: center;
}
    .btn_tj{
        width: 120px;
        height: 40px;
        background-color: #fb8ca6;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
        line-height: 40px;
        color: white;
        margin-left: 20px;
        cursor: pointer;
    }
.search-Input {
    position: absolute;
    top: 50%;
    right: 70px;
    margin-top: -25px;
    float: left;

}

.search-Input input {
    height: 48px;
    width: 433px;
    outline: none;
    padding-left: 10px;
    border: solid 1px #e5e5e5;
    border-radius: 5px 0px 0px 5px;
}

.search-icon {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -25px;
    background-color: #fb8ca6;
    border-radius: 0px 5px 5px 0px;
}
.listhead {
    width: 100%;
    height: 70px;
    margin-top: 10px;
}

.listhead li {
    float: left;
    height: 70px;
    line-height: 70px;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    color: #fb8ca6;
    background-color: #ffffff;
    margin-right: 0.2%;
}

.font_color li {
    color: #5f5f5f;
}

.list_color li {
    color: black;
}

.listhead li:nth-of-type(1), .listhead li:nth-of-type(2) ,.listhead li:nth-of-type(3),.listhead li:nth-of-type(6){
    width: 9%;
}

.listhead li:nth-of-type(4) {
    width: 13%;
}
 .listhead li:nth-of-type(5){
     width: 15.8%;
 }
.listhead li:nth-of-type(7) {
    width: 11.8%
}

.listhead li:nth-of-type(8) {
    width: 10%
}
.listhead li:nth-of-type(9) {
  width: 11.6%
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
    font-size: 16px;
}

.all span i {
    color: #fb8ca6;
}


.xf_content{
    padding-left: 20px;
}
.xf_content>div:nth-of-type(1),.xf_content>div:nth-of-type(2){
    margin-bottom: 10px;
}
.xf_content p{
    margin-bottom: 3px;
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
  height: 250px;
  overflow: auto;
}
.el-input{
  width: 180px;
  display: block;
  margin-top: 5px;
  margin-left: 24px;
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
