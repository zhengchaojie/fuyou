<template>
  <div class="contents">
    <!--<div class="head_navs">-->
      <!--&lt;!&ndash;<div class="btn_tj" @click="dialogVisible=true">条件搜索</div>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="search-Input">&ndash;&gt;-->
        <!--&lt;!&ndash;<input type="text" placeholder="姓名/手机号" v-model="search">&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
      <!--&lt;!&ndash;<div class="search-icon" @click="Serach()">&ndash;&gt;-->
        <!--&lt;!&ndash;<img src="../../assets/images/search.png" height="30" width="30">&ndash;&gt;-->
      <!--&lt;!&ndash;</div>&ndash;&gt;-->
    <!--</div>-->

    <div class="content">
      <ul class="listhead">
        <li>班级序号</li>
        <li>教室名称</li>
        <li>授课老师</li>
        <li>开班时间</li>
        <li>结束时间</li>
        <li>共计学生</li>
      </ul>
      <ul class="listhead font_color" v-for="(item,index) in data3">
        <li>{{item.className}}</li>
        <li>{{item.studyRoom}}</li>
        <li>{{item.teacherName}}</li>
        <li>{{item.createTime}}</li>
        <li>{{item.updatetTime}}</li>
        <li>{{item.studentNum}}</li>
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
            <p>状态</p>
            <el-select v-model="selectvalue_status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
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
          <div>
            <p>开始日期</p>
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div>
            <p>结束日期</p>
            <el-date-picker
              v-model="value2"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
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
    name: "list8",
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
        options: [{
          value: '1',
          label: '待确认'
        }, {
          value: '2',
          label: '代缴费'
        }, {
          value: '3',
          label: '已续费'
        }, {
          value: '4',
          label: '驳回'
        }, {
          value: '5',
          label: '已取消'
        }],
        selectvalue_status: '',
        selectvalue_kc:"",
        options_kc: [{
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
    },
    methods:{
      handleCurrentChange(val){
        var that=this
        axios.post(that.url+"/wcfy/sys/class/openClassRecord"+"?loginId="+that.loginId+"&token="+that.token,
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
            that.data3=[];
            that.total= 0;
          }else{
            that.data3=response.data.page.records;
            that.total=response.data.page.total;
          }
        })
      },
      requestData(){
        var that=this
        axios.post(that.url+"/wcfy/sys/class/openClassRecord"+"?loginId="+that.loginId+"&token="+that.token,
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
            that.total= 0;
          }else{
            that.data3=response.data.page.records;
            that.total=response.data.page.total;
          }
        })
      },
      //搜索
      Serach(){
        var that=this
        axios.post("http://gwz.premier-tech.cn/wcfy/sys/renewal/loadRenewalList",
          {
            pageNum:1,
            pageSize:10,
            babyAndPhone:that.search,
          }).then(function(response){
          if(response.data.code==500){
            that.$message({
              type:'error',
              message:response.data.msg
            })
          }else{
            that.data3=response.data.renewalList
            that.total=response.data.total
          }
        })
      },
      //续费操作
      agree(id){
        var that=this
        axios.post("http://gwz.premier-tech.cn/wcfy/sys/renewal/agreedToRenewal",
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
        axios.post("http://gwz.premier-tech.cn/wcfy/sys/renewal/rejectedRenewal",
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
        var that=this
        let begindate = getLastDate(that.value1);
        let enddate = getLastDate(that.value2);
        if(begindate!=''&&enddate==''){
          this.$message("请选择查询条件")
          this.dialogVisible = true
          return
        }
        if(enddate!=''&&begindate==''){
          this.$message("请选择查询条件")
          this.dialogVisible = true
          return
        }
        axios.post("http://gwz.premier-tech.cn/wcfy/sys/renewal/loadRenewalList",
          {
            pageSize:10,
            pageNum:1,
            gradeId:that.selectvalue_kc,
            renewalStatus:that.selectvalue_status,
            beginDate:begindate,
            endDate:enddate
          }).then(function(response){
          if(response.data.code==500){
            that.$message({
              type:'error',
              message:response.data.msg
            })
          }else{
            that.data3=response.data.renewalList
            that.total=response.data.total
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

  .listhead li:nth-of-type(1) {
    width: 11%;
  }
  .listhead li:nth-of-type(2) {
    width: 20%;
  }
  .listhead li:nth-of-type(3) {
    width: 15%;
  }
  .listhead li:nth-of-type(4) {
    width: 20%;
  }
  .listhead li:nth-of-type(5){
    width: 20%;
  }
  .listhead li:nth-of-type(6) {
    width: 12.6%;
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

</style>
