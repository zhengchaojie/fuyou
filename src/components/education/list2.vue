<template>
    <div>
        <div class="contents">
            <div class="head_navs">
                <div class="search_btn" @click="dialogVisibles=true">
                    条件搜索
                </div>
                <div class="search-Input">
                    <input type="text" placeholder="宝宝姓名/手机号" v-model="search">
                </div>
                <div class="search-icon" @click="Serach()">
                    <img src="../../assets/images/search.png" height="30" width="30">
                </div>
                <!--<div class="new_add" @click="dialogVisible = true">-->
                    <!--新增学生-->
                <!--</div>-->
            </div>

            <div class="content">
                <ul class="listhead">
                    <li>姓名</li>
                    <li>年龄</li>
                    <li>监护人</li>
                    <li>手机号</li>
                    <li>课程</li>
                    <li>班级</li>
                    <li>状态</li>
                    <li>详情</li>
                </ul>
                <ul class="listhead font_color" v-for="(item,index) in data_list">
                    <li>{{item.babyName}}</li>
                    <li>{{item.babyAge}}岁</li>
                    <li>{{item.guardianName}}</li>
                    <li>{{item.guardianPhone}}</li>
                    <li>{{item.gradeName}}</li>
                    <li>{{item.className}}</li>
                    <li v-if="item.orderStatus==1">已预约</li>
                    <li v-else-if="item.orderStatus==2">排队中</li>
                    <li v-else-if="item.orderStatus==3">已取消</li>
                    <li v-else-if="item.orderStatus==4">待支付</li>
                    <li v-else-if="item.orderStatus==5">服务中</li>
                    <li v-else="item.orderStatus==6">已完成</li>
                    <li @click="detail=true;detailInfo(item)">详情</li>
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
                                :page-size="8"
                                v-if="total <= 8 ? false:true"
                                @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </template>
            </div>


            <!--新增-->
            <div class="zj_add">
                <el-dialog
                        title="提示"
                        :visible.sync="dialogVisible"
                        width="30%"
                        >
                    <div class="add_list">
                        <div class="item">
                            <p>宝宝姓名</p>
                            <input type="text" placeholder="请输入姓名" v-model="add_info.bagename">
                        </div>
                        <div class="item">
                            <p>年龄</p>
                            <input type="text" placeholder="请输入年龄" v-model="add_info.age">
                        </div>
                        <div class="item">
                            <p>出生日期</p>
                            <el-date-picker
                                    v-model="value1"
                                    type="date"
                                    placeholder="请选择日期">
                            </el-date-picker>
                        </div>
                        <div class="item">
                            <p>监护人姓名</p>
                            <input type="text" placeholder="请输入姓名" v-model="add_info.name">
                        </div>
                        <div class="item">
                            <p>监护人电话</p>
                            <input type="text" placeholder="请输入电话" v-model="add_info.phone">
                        </div>
                        <div class="item">
                            <p>课程</p>
                            <el-select v-model="selectvalue_kc" placeholder="请选择">
                                <el-option
                                        v-for="item in options_kc"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="item">
                            <p>班级</p>
                            <el-select v-model="value_bj" placeholder="请选择">
                                <el-option
                                        v-for="item in options_bj"
                                        :key="item.id"
                                        :label="item.className"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>


                    </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false,new_student()">确 定</el-button>
            </span>
                </el-dialog>
            </div>
            <!--条件-->
            <div class="tj_search xf_search">
                    <el-dialog
                            title="条件搜索"
                            :visible.sync="dialogVisibles"
                            width="30%"
                    >
                        <div class="xf_content">
                            <div>
                                <p>课程</p>
                                <el-select v-model="selectvalue_kc"  @change="req_nianlin"  placeholder="请选择">
                                    <el-option
                                            v-for="item in options_kc"

                                            :label="item.gradeName"
                                            :value="item.gradeId">
                                    </el-option>
                                </el-select>
                            </div>
                          <div>
                            <p>儿童月龄</p>
                            <el-select v-model="selectvalue_status" placeholder="请选择">
                              <el-option
                                v-for="item in options"

                                :label="item"
                                :value="item">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisibles = false">取 消</el-button>
                     <el-button type="primary" @click="dialogVisibles = false,select_search()">确 定</el-button>
                </span>
                    </el-dialog>
            </div>
            <!--详情-->
            <div class="zj_detail">
                <el-dialog
                        title="课程详情"
                        :visible.sync="detail"
                        width="30%"
                        >
                    <div class="zj_details">
                        <ul>

                            <li class="used" v-for="(item,index) in courseInfoList" v-if="item.courseStatus==2" >
                                <div>
                                    <div>已使用</div>
                                    <div>{{item.afterDate}}</div>
                                </div>
                            </li>
                          <li class="used" v-for="(item,index) in courseInfoList" v-if="item.courseStatus==4" >
                            <div>
                              <div>缺课</div>
                              <div>{{item.afterDate}}</div>
                            </div>
                          </li>
                            <li class="wait_use" v-else-if="item.courseStatus==1 ">
                                <div>待使用</div>
                                <span class="qingjia" @click="qingjia(item)">请假</span>
                                <span class="queke" @click="queke(item)">缺课</span>
                            </li>
                          <li class="wait_use" v-else-if="item.courseStatus==3">
                            <div>请假</div>
                          </li>
                          <!--<li class="wait_use" v-else-if="item.courseStatus==4">-->
                            <!--<div>缺课</div>-->
                          <!--</li>-->
                        </ul>
                    </div>
                    <span slot="footer" class="dialog-footer">

                <el-button @click="detail = false">取 消</el-button>
                <el-button type="primary" @click="detail = false">确 定</el-button>
            </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import {getLastDate,familyDoctor} from "./../../common/util.js"
    export default {
        name: "list2",
        data() {
            return {
                url:familyDoctor(),
                dialogVisible: false,//新增
                total: 0,
                id: "",
                token: "",
                loginId: "",
                search: "",
                data_list:'',
                dialogVisibles: false,//条件
                detail:false,//详情
                courseInfoList:"",//详情
                value1:"",//出生日期
                add_info:{
                    bagename:'',
                    age:"",
                    name:"",
                    phone:""
                },
                options: [
                  {
                    value: '1',
                    label: '已预约'
                }, {
                    value: '2',
                    label: '排队中'
                }, {
                    value: '3',
                    label: '已取消'
                }, {
                    value: '4',
                    label: '待支付'
                }, {
                    value: '5',
                    label: '服务中'
                },{
                    value: '6',
                    label: '已完成'
                },],
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
                options_bj:'',
                value_bj:"",
                gradeId:"",
                xqId:""
            };
        },
        created(){
          this.token = window.localStorage.getItem("token");
          this.loginId = window.localStorage.getItem("loginId");
          this.requestData();
          this.req_banji();

        },
        watch:{

        },
        methods:{
            handleCurrentChange(val){
                var that=this
                if(that.selectvalue_status!=''||that.selectvalue_kc!=''){
                  let yuelin = (that.selectvalue_status).substr(0,5)
                    axios.post(that.url+"/wcfy/sys/order/studentMan"+"?loginId="+that.loginId+"&token="+that.token,
                        {
                            pageNum:val,
                            pageSize:10,
                            monthAge:yuelin,
                            gradeId:that.selectvalue_kc
                        }).then(function(response){
                        if(response.data.code==500){
                            that.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }else{
                          that.data_list=response.data.page.records
                          that.total=response.data.page.total
                        }
                    })
                }else{

                    axios.post(that.url+"/wcfy/sys/order/studentMan"+"?loginId="+that.loginId+"&token="+that.token,
                        {
                            pageNum:val,
                            pageSize:10
                        }).then(function(response){
                          console.log(response)
                        if(response.data.code==500){
                            that.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }else{
                          that.data_list=response.data.page.records
                          that.total=response.data.page.total
                        }
                    })
                }
            },
            requestData(){
                var that=this
                axios.post(that.url+"/wcfy/sys/order/studentMan"+"?loginId="+that.loginId+"&token="+that.token,
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
                        that.data_list=response.data.page.records
                        that.total=response.data.page.total
                    }
                })
            },
            //详情
            detailInfo(obj){
                this.xqId = obj.id;
                var that=this;
                axios.post(that.url+"/wcfy/sys/order/selectCourceInfo"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        orderId:this.xqId
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        console.log(response)
                        that.courseInfoList=response.data.courseInfoList
                    }
                })
            },
           detailInfo1(id){
            var that=this;
            axios.post(that.url+"/wcfy/sys/order/selectCourceInfo"+"?loginId="+that.loginId+"&token="+that.token,
              {
                orderId:id
              }).then(function(response){
              if(response.data.code==500){
                that.$message({
                  type:'error',
                  message:response.data.msg
                })
              }else{
                console.log(response)
                that.courseInfoList=response.data.courseInfoList
              }
            })
          },
            //搜索
            Serach(){
                var that=this
                axios.post(that.url+"/wcfy/sys/order/studentMan"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:1,
                        pageSize:10,
                        searchKey:that.search,
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                      that.data_list=response.data.page.records
                      that.total=response.data.page.total
                    }
                })
            },
            new_student(){
                var that=this
                if(that.add_info.bagename==''||that.add_info.age==''||that.add_info.name==''||that.add_info.phone==''
                ||that.selectvalue_kc==''||that.value_bj==''||getLastDate(that.value1)==''){
                    that.$message({
                        type:'error',
                        message:'请填写完整的信息'
                    })
                    return
                }
                if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(that.add_info.phone))){
                    that.$message({
                        type:'error',
                        message:'手机号码有误'
                    })
                      return false;
                }
                axios.post(that.url+"/wcfy/sys/order/saveNewStudent"+"?loginId="+that.loginId+"&token="+that.token,
                    {
                        babyName:that.add_info.bagename,
                        babyBirthday:getLastDate(that.value1),
                        babyAge:that.add_info.age,
                        guardianName:that.add_info.name,
                        guardianPhone:that.add_info.phone,
                        gradeId:that.selectvalue_kc,
                        classId:that.value_bj
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.requestData()
                    }
                })
            },
            select_search(){
                var that=this
              let monthAge ;
              if(that.selectvalue_status != ""){
                monthAge = (that.selectvalue_status).substr(0,5);
              }
                    axios.post(that.url+"/wcfy/sys/order/studentMan"+"?loginId="+that.loginId+"&token="+that.token,
                        {
                            pageNum:1,
                            pageSize:10,
                            monthAge:monthAge,
                            gradeId:that.selectvalue_kc
                        }).then(function(response){
                        if(response.data.code==500){
                            that.$message({
                                type:'error',
                                message:response.data.msg
                            })
                        }else{
                            that.data_list=response.data.page.records
                            that.total=response.data.page.total
                        }
                    })
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
           //请假
           qingjia(obj){
             console.log(obj)
             let id = obj.id;
             this.$confirm('确定此次课程请假, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               var that=this;
               axios.post(that.url+"/wcfy/sys/class/updateCourseStatus"+"?loginId="+that.loginId+"&token="+that.token,
                 {
                   courseId:id,
                   courseStatus:"3",
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
                   that.bac0 = false;
                   console.log(that.xqId)
                   that.detailInfo1(that.xqId);
                 }
               })
             })
           },
          //缺课
          queke(obj){
            let id = obj.id;
            this.$confirm('确定此次课程缺课, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              var that=this;
              axios.post(that.url+"/wcfy/sys/class/updateCourseStatus"+"?loginId="+that.loginId+"&token="+that.token,
                {
                  courseId:id,
                  courseStatus:"4",
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
                  that.bac0 = false;
                  that.detailInfo1(that.xqId);
                }
              })
            })
          }
        }
    }
</script>

<style scoped>
.head_navs{
    height: 70px;
    background-color: #fff;
    display: flex;
    padding: 0 20px;
    align-items: center;
    font-size: 16px;
    position: relative;
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
    background-color: #fb8ca6;
    border-radius: 0px 5px 5px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-icon img{
    cursor: pointer;
    margin-left: 0;
    margin-top: 0;
    position: initial;
}
    .search_btn,.new_add{
        width: 120px;
        height: 40px;
        line-height: 40px;
        background-color: #fb8ca6;
        border-radius: 5px;
        color: white;
        text-align: center;
        cursor: pointer;
        margin-right: 30px;
    }
    .new_add{
       position: absolute;
        right: 0;
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

.listhead li:nth-of-type(1),.listhead li:nth-of-type(2),.listhead li:nth-of-type(3), .listhead li:nth-of-type(5),
.listhead li:nth-of-type(7),.listhead li:nth-of-type(8){
    width:12%;
}
 .listhead li:nth-of-type(4) {
    width: 13%;
}

.listhead li:nth-of-type(6) {
    width: 13.3%;
}
.listhead li:nth-of-type(8){
    cursor: pointer;
    color: #fb8ca6;
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

.zj_details ul{
    overflow: hidden;
}
.zj_details ul li{
    border-radius: 10px;
    width: 118px;
    height: 110px;
    margin-bottom: 20px;
    float: left;
    margin-right: 15px;
}
.zj_details ul li:nth-of-type(5),.zj_details ul li:nth-of-type(10){
    margin-right: 0;
}
    .used{

        background-color: #fff;

        border: solid 1px #bbbbbb;
    }
    .used>div>div:nth-of-type(1){
        font-size: 26px;
        letter-spacing: 1px;
        text-align: center;
        height: 80px;
        line-height: 80px;
        color:#bbb;
        font-weight: bold;
    }
.used>div>div:nth-of-type(2){
    font-size: 16px;
    letter-spacing: 1px;
    text-align: center;
    color:#bbb;
}
    .wait_use{
        background-color: #ffe7ed;
        border: solid 1px #fb8ca6;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
.wait_use:hover span{
    display: inline-block;
}
    .qingjia{
      position: absolute;
      left: 5px;
      display: inline-block;
      width: 50px;
      border: 1px solid #fb8ca6;
      text-align: center;
      top: 10px;
      color: #fb8ca6;
      border-radius: 5px;
      cursor: pointer;
      display: none;
    }
    .queke{
      position: absolute;
      right: 5px;
      display: inline-block;
      width: 50px;
      border: 1px solid #fb8ca6;
      text-align: center;
      top: 10px;
      color: #fb8ca6;
      border-radius: 5px;
      cursor: pointer;
      display: none;
    }
    .wait_use div{
        color:#fb8ca6 ;
        font-size: 26px;
        font-weight: bold;
        text-align: center;
    }
</style>
<style scoped>

    .zj_details{
       padding: 20px 40px 40px;
        margin: auto;
    }
    .zj_add .add_list p{
       width: 80px;
        text-align: center;
        margin-right: 10px;
    }
    .add_list .item{
        display: flex;
        height: 50px;
        align-items: center;
    }
    .item input{
        width: 168px;
        height: 33px;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        padding-left: 10px;
    }
    .item input:focus{
        outline: #0077aa;
        border: 1px solid #20a0ff;

    }
    .item>>>.el-input__inner{
        width: 180px!important;
    }
    #app > div > div.page_content > div > section > div > div > div > div > div.zj_add > div > div > div.el-dialog__body > div > div:nth-child(6) > div > div.el-input > input{
        width: 180px!important;
    }
    .el-date-editor.el-input{
        width: 180px!important;
        margin-bottom: 0!important;
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
    .search-Input input{
      position: absolute;
      top: 50%;
      right: 70px;
      margin-top: -25px;
      float: left;
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
</style>
