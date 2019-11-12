<template>
<div id="app" v-loading.fullscreen.lock="fullscreenLoading">
  <div class="head_navs">
    <div class="search_btn" @click="dialogVisibles=true">
      条件搜索
    </div>
    <div class="search-Input">
      <input type="text" placeholder="宝宝姓名/手机号" v-model="search">
    </div>
    <div class="search-icon" @click="Search()">
      <img src="../../assets/images/search.png" height="30" width="30">
    </div>

  </div>
<div class="content">
  <ul  class="listhead">
        <li>体检人姓名</li>
        <li>出生日期</li>
        <li>提交时间</li>
        <li>体检时间</li>
        <li>预约人姓名</li>
        <li>手机号码</li>

   </ul>
   <ul  class="listhead font_color" v-for="(item,index) in data3">
        <li>{{item.etxm}}</li>
        <li>{{item.csrq}}</li>
        <li>{{item.createTime}}</li>
        <li>{{item.tjrq}}</li>
        <li>{{item.jhrxm}}</li>
        <li>{{item.phone}}</li>

   </ul>
</div>
  <div class="bac" v-show="dialogVisibles" >
    <div class="con" >
      <span class="tit">编辑班级</span>
      <span class="tits">选择日期</span>
      <el-date-picker
        v-model="value6"
        type="daterange"
        format="yyyy 年 MM 月 dd 日"
        range-separator="至"
        start-placeholder="开始日期"
        value-format="yyyy-MM-dd"
        end-placeholder="结束日期">
      </el-date-picker>

      <span  class="foot">
             <el-button @click="dialogVisibles = false">取 消</el-button>
             <el-button type="primary" @click="bianji()">确 定</el-button>
            </span>
    </div>
  </div>
  <!--条件-->

<!-- 分页 -->
<div class="all" >
  <span>共&nbsp;<i style="font-style: normal;">{{total}}</i>&nbsp;条</span>
  <template>
    <!-- 分页 -->
    <div class="block" id="vaccine_list1">
      <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="5"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      v-if="total<=5?false:true"
      ref = "fenye">
    </el-pagination>
  </div>
</template>
</div>
</div>

</template>
<script>
import axios from "axios"
import {familyDoctor,checobox, checkStatus} from "./../../common/util.js"
export default {
  data() {
    return {
      dialogVisibles: false,
      search: "",
      value: [],
      id:"",
      disabled:false,
      total: "0",    //总页数
      isShow: false,
      data3: [],
      beginDate:"",
      endDate:"",
      loginId:"",
      token:"",
      currentPage:1,
       fullscreenLoading:false,
      checkBox: {
        checked: false,
        items: []
      },
      value6:"",
    };
  },
  watch:{
    $route() {
      this.$router.go(0)
    }

},
  created: function() {
    this.token = window.localStorage.getItem("token");
    this.loginId = window.localStorage.getItem("loginId");
    this.id=window.localStorage.getItem("id")
    this.requestData();
  },
  methods: {
    //数据交互
    requestData() {
      let _this = this;
       checkStatus(_this)
      let url = familyDoctor();
      axios.post(url + "/wcfy/sys/xxsc/list?loginId="+_this.loginId+"&token="+_this.token,{
        pageNum:1,
        pageSize:5
      }).then(function(response) {
         console.log(response)
        _this.data3 = response.data.page.records;
        _this.total = response.data.page.total;
      })
    },

    //分页
    handleCurrentChange(val) {
      let url = familyDoctor();
      let _this = this;

      if(_this.value6 != ""|| _this.value6.length != 0 || _this.value6 != 'null' ){
        let beginDate = this.value6[0];
        console.log(this.value6[0])
        let endDate = this.value6[1];
         axios.post(url + "/wcfy/sys/xxsc/list?loginId="+_this.loginId+"&token="+_this.token,{
           beginDate:beginDate,
           endDate:endDate,
           pageNum:val,
           pageSize:5
      }).then(function(response) {
           if(response.data.code ==0){
             _this.data3 = response.data.page.records;
             _this.total = response.data.page.total;
           }else{
             _this.$message({
               message:response.data.msg,
               type:"error"
             })
             _this.data3 = [];
             _this.total = 0;
           }
        });
      }else{
        axios.post(url + "/wcfy/sys/xxsc/list?loginId="+_this.loginId+"&token="+_this.token,{
          pageNum:val,
          pageSize:5,
          searchKey:_this.search
      }).then(function(response) {
          console.log(response)
          if(response.data.code ==0){
            _this.data3 = response.data.page.records;
            _this.total = response.data.page.total;
          }else{
            _this.$message({
              message:response.data.msg,
              type:"error"
            })
            _this.data3 = [];
            _this.total = 0;
          }
      });
     }

   },
    // 搜索
    Search() {
      let url = familyDoctor();
      let _this = this;
      console.log("aaa")
      axios.post(url + "/wcfy/sys/xxsc/list?loginId="+_this.loginId+"&token="+_this.token,{
        pageNum:1,
        pageSize:5,
        searchKey:_this.search
      }).then(function(response) {
        console.log(response)
        if(response.data.code ==0){
          _this.data3 = response.data.page.records;
          _this.total = response.data.page.total;
        }else{
          _this.$message({
            message:response.data.msg,
            type:"error"
          })
          _this.data3 = [];
          _this.total = 0;
        }
      });
    },
    //条件搜索
    bianji(){
      let url = familyDoctor();
      let _this = this;
      console.log(_this.value6)
      let beginDate = "",endDate="";
      if(this.value6 === null){
        this.value6 = []
      }

      if(_this.value6 != ""  || _this.value6 != 'null'|| _this.value6.length != 0 ||  _this.value6 != null){
         beginDate = this.value6[0];
         endDate = this.value6[1];
      }

      axios.post(url + "/wcfy/sys/xxsc/list?loginId="+_this.loginId+"&token="+_this.token,{
        pageNum:1,
        pageSize:5,
        endDate:endDate,
        beginDate:beginDate
      }).then(function(response) {
        _this.dialogVisibles = false;
        if(response.data.code ==0){
          _this.data3 = response.data.page.records;
          _this.total = response.data.page.total;
        }else{
          _this.$message({
            message:response.data.msg,
            type:"error"
          })
          _this.data3 = [];
          _this.total = 0;
        }

      });
    }
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
  .search_btn{
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
.listhead li:nth-of-type(1),.listhead li:nth-of-type(5){
  width: 11%;
}
.listhead li:nth-of-type(2){
  width: 20%;
}
.listhead li:nth-of-type(3),.listhead li:nth-of-type(4){
  width: 20.903%;
}
.listhead li:nth-of-type(6){
  width: 15%;
}
.listhead li:nth-of-type(7){
  width: 13.6%;
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
.dialog-footer{
  display: block;
  width: 100%;
  height: 100%;
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
</style>
