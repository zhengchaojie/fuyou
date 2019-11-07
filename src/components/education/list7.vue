<template>
  <div class="contents">
    <div class="head_navs">
      <div class="btn_tj" @click="dialogVisible=true">条件搜索</div>
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
        <li>试听时间</li>
        <li>操作</li>
      </ul>
      <ul class="listhead font_color" v-for="(item,index) in data3">
        <li>{{item.babyName}}</li>
        <li>{{item.babyAge}}</li>
        <li>{{item.guardianName}}</li>
        <li>{{item.guardianPhone}}</li>
        <li>{{item.gradeName}}</li>
        <li>{{item.monthAge}}</li>
        <li>{{item.auditionDate}}</li>
        <li>
          <span class="green" @click="buy(item)">可购买</span>
          <span class="yellow" @click="bohui(item)">驳回</span>
        </li>
      </ul>

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
            <el-select v-model="selectvalue_kc"  @change="req_nianlin" placeholder="请选择">
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
                     <el-button type="primary" @click="dialogVisible = false;search_select()">确 定</el-button>
                </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import {getLastDate,familyDoctor} from "./../../common/util.js"
  export default {
    name: "list7",
    data() {
      return {
        total:0,
        id: "",
        token: "",
        loginId: "",
        url:familyDoctor(),
        search: "",
        value1: "",  //  开始日期
        value2: "",  //  截止日期
        startDate: "",
        endDate: "",
        data3: [],
        dateStart: "",
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
      };
    },
    created(){
      this.token = window.localStorage.getItem("token");
      this.loginId = window.localStorage.getItem("loginId");
      this.requestData()
      this.req_banji();
    },
    methods:{
      handleCurrentChange(val){
        var that=this
        if(that.selectvalue_status!=''||that.selectvalue_kc!=''){
          let monthAge = (that.selectvalue_status).substr(0,5);
          axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
            {
              pageSize:10,
              pageNum:val,
              gradeId:that.selectvalue_kc,
              monthAge:monthAge,
            }).then(function(response){
            if(response.data.code==500){
              that.$message({
                type:'error',
                message:response.data.msg
              })
              that.data3=[];
              that.total= 0;
            }else{
              that.data3=response.data.page.records;
              that.total=response.data.page.total;
            }
          })
        }else{
          axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
            {
              pageNum:val,
              pageSize:10
            }).then(function(response){
            if(response.data.code==500){
              that.$message({
                type:'error',
                message:response.data.msg
              })
              that.data3=[];
              that.total= 0;
            }else{
              that.data3=response.data.page.records;
              that.total=response.data.page.total;
            }
          })
        }
      },
      requestData(){
        var that=this
        axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
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
            that.data3=[];
            that.total=0;
          }else{
            that.data3=response.data.page.records;
            that.total=response.data.page.total;
          }
        })
      },
      //搜索
      Serach(){
        var that=this
        axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
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
            that.data3=response.data.page.records;
            that.total=response.data.page.total;
            that.search = ""
          }
        })
      },
      //续费操作
      agree(id){
        var that=this
        axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
          {
            renewalId:id
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
            that.requestData()
          }
        })
      },
      isagree(id){
        var that=this
        axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
          {
            renewalId:id
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
            that.requestData()
          }
        })
      },
      //条件搜索
      search_select(){
        var that=this;
        let monthAge ;
        if(that.selectvalue_status != ""){
          monthAge = (that.selectvalue_status).substr(0,5);
        }

        axios.post(that.url+"/wcfy/sys/order/auditionList"+"?loginId="+that.loginId+"&token="+that.token,
          {
            pageSize:10,
            pageNum:1,
            gradeId:that.selectvalue_kc,
            monthAge:monthAge
          }).then(function(response){
          if(response.data.code==500){
            that.$message({
              type:'error',
              message:response.data.msg
            })
            that.data3=[];
            that.total= 0;
          }else{
            that.data3=response.data.page.records;
            that.total=response.data.page.total;
          }
        })
      },
      //驳回
      bohui(obj){
        this.$confirm('确定驳回此条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var that=this;
          let id = obj.id;
          axios.post(that.url+"/wcfy/sys/order/updateOrderStatus"+"?loginId="+that.loginId+"&token="+that.token,
            {
              orderId:id,
              orderStatus:"2"
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
              that.requestData()
            }
          })

        })
      },
      //购买
      buy(obj){
        this.$confirm('确定同意此条购买信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var that = this;
            let id = obj.id
            axios.post(that.url+"/wcfy/sys/order/allowPay"+"?loginId="+that.loginId+"&token="+that.token,
              {
                orderId:id
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
                that.requestData()
              }
            })

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

  .listhead li:nth-of-type(1){
    width: 10%;
  }
  .listhead li:nth-of-type(2){
    width: 10%;
  }
  .listhead li:nth-of-type(3){
    width: 13%;
  }
  .listhead li:nth-of-type(4){
    width: 10%;
  }
  .listhead li:nth-of-type(5){
    width: 15%;
  }
  .listhead li:nth-of-type(6) {
    width: 10%;
  }
  .listhead li:nth-of-type(7){
    width: 15%;
  }
  .listhead li:nth-of-type(8){
    width: 15%;
  }
  .agree{
    color: #df701e;
    cursor: pointer;
  }
  .isagree{
    color: #00C1DE;
    cursor: pointer;
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
  .green{
    color: #22ac38;
    cursor: pointer;
  }
  .yellow{
    color: #f39800;
    margin-left: 12px;
    cursor: pointer;
  }
</style>
