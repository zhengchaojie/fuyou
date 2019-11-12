<template>
  <div id="app" v-loading.fullscreen.lock="fullscreenLoading">
    <div v-show="firstschool">
      <div class="goschool-nav">
        <!--<el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 20px" @click="tiaojian = true">添加学校</el-button>-->
        <div class="search-Input">
          <input type="text" v-model="search" placeholder="学校名称">
        </div>
        <div class="search-icon" @click="Search()">
          <img src="../../assets/images/search.png" height="30" width="30">
        </div>
      </div>
      <!--<el-dialog title="添加学校" :visible.sync="tiaojian">-->
      <!--<span>学校名称</span><el-input v-model="schoolname"></el-input>-->
      <!--<span>账户</span><el-input readonly="readonly" v-model="schoolname"></el-input>-->
      <!--<span>密码</span><el-input type="password"></el-input>-->
      <!--<div style="font-size: 0;text-align: center;padding-top: 20px">-->
      <!--<el-button style="background-color: #20a0ff;color: white" @click="tiaojian = false;createsc">确 定</el-button>-->
      <!--<el-button @click="tiaojian = false">取 消</el-button>-->
      <!--</div>-->
      <!--</el-dialog>-->
      <div class="content">
        <ul class="listhead">
          <li>学校名称</li>
          <li>已缴费人数</li>
          <li>学生总数</li>
          <li>金额(元)</li>

          <li>操作</li>
        </ul>
        <ul class="listhead font_color" v-for="(item,index) in data3">
          <li>{{item.schoolName}}</li>
          <li>{{item.payCount}}</li>
          <li>{{item.studentCount}}</li>
          <li>{{item.totalAmount}}</li>
          <li @click="setting(item)">查看</li>
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

    <!--学校详情列表-->
    <div v-show="secondschool">
      <div class="goschool-nav" style="line-height:70px;">
        <span style="margin-left: 5%;cursor: pointer;font-size: 25px;color: #9d9d9f" @click="fanhui"
              class="iconfont icon-iconfanhuishangyiji"></span>
        <span style="font-size: 22px;font-weight: 700;margin-left: 5%">{{sname}}</span>

        <!--<el-button  style="background-color: #fb8ca6;color: white;width: 100px;height: 50px;margin-top: 10px;border: 0;margin-left: 10%" @click="xinjian = true">新建班级</el-button>-->
      </div>

      <div class="content">
        <div class="overScroll">
        <ul class="test" >
          <li>项目/人数</li>
          <li v-for="(item,index) in data6">{{item.medicalName}}</li>
        </ul>
        <ul class="test font_color" >
          <li>人数</li>
          <li v-for="(item,index) in data6">{{item.totalAmount}}</li>

        </ul>
        <ul class="test font_color" >
          <li>金额(元)</li>
          <li v-for="(item,index) in data6">{{item.studentCount}}</li>

        </ul>
        </div>
      </div>


    </div>

    <!--班级学生详情列表-->
    <!--<div v-show="thirdclass">-->
    <!--<div class=""></div>-->
    <!--</div>-->
  </div>

</template>

<script>
  import axios from "axios";
  import {familyDoctor, getLastDate2, checobox, checkStatus} from "./../../common/util.js";
  import {getLastDate} from "../../common/util";

  export default {
    data() {
      return {
        firstschool: true,
        secondschool: false,
        thirdclass: false,
        schoolname: "",
        schoolpwd: "",
        classtype: "",
        classname: "",
        search: "",
        xinjian: false,
        disabled: false,
        dialogVisible: false,
        url: familyDoctor(),
        data1: [],
        data3: [],
        data4: [{"school": "小天才幼儿园", "banji": "34", "renshu": "66", "state": 1, "riqi": "2019-02-15 12:00"},
          {"school": "大天才幼儿园", "banji": "29", "renshu": "99", "state": 0, "riqi": "2019-02-15 12:00"},
          {"school": "小天才幼儿园", "banji": "42", "renshu": "70", "state": 1, "riqi": "2019-02-15 12:00"},
          {"school": "小天才幼儿园", "banji": "99", "renshu": "524", "state": 1, "riqi": "2019-02-15 12:00"},
          {"school": "小天才幼儿园", "banji": "86", "renshu": "381", "state": 0, "riqi": "2019-02-15 12:00"},
        ],
        data5: [
          {
          "bianhao": "1",
          "name": "小明",
          "class": "小1班",
          "jihu": "大明",
          "phone": "138 8888 8888",
          "bicha": 1,
          "xuancha": "",
          "price": "24"
        },
          {
            "bianhao": "2",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 0,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "3",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 0,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "4",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 1,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "5",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 1,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "6",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 0,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "7",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 1,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "8",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 0,
            "xuancha": "",
            "price": "24"
          },
          {
            "bianhao": "9",
            "name": "小明",
            "class": "小1班",
            "jihu": "大明",
            "phone": "138 8888 8888",
            "bicha": 1,
            "xuancha": "",
            "price": "24"
          },],
        data6:{},
        data7:{},
        id: "",
        radio: '',
        total: 0,   // 分页总数
        value1: '',
        value2: '',
        token: "",
        loginId: "",
        fullscreenLoading: false,
        wuhan: "",
        cramer: false,
        xuanzhuan: false,
        proveimg: [],
        fristimg: "",
        secondimg: "",
        tiaojian: false,
        startTime: "",
        endTime: "",
        selectway: "",
        choosed: false,
        mes: false,
        sname:""
      };
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
    methods: {
      //学校详情查看
      setting(obj) {
           let schoolid  = obj.id;
           this.sname = obj.schoolName;
          let _this = this;
          checkStatus(_this)
          let url=familyDoctor()
          let schoolname = obj.school;
          axios.post(_this.url+"/wcfy/zytj/selectSchoolInfo" + "?loginId="+_this.loginId+"&token="+_this.token,
            {
            schoolId:schoolid,
          }).then((response)=>{
            console.log(response)
              _this.data6 = response.data.data;
          })
        this.firstschool = false;
        this.secondschool = true;

      },
      fanhui() {
        this.firstschool = true;
        this.secondschool = false;
      },

      chakan() {
        this.mes = true;
      },
      guanbi() {
        this.mes = false;
      },
      closedlist() {

      },
     // 数据交互
      request: function() {
        let _this = this;
        checkStatus(_this)
        let url=familyDoctor()
        axios.post(_this.url+"/wcfy/zytj/selectSchools" + "?loginId="+_this.loginId+"&token="+_this.token,{
          searchKey:"",
          pageNum:1,
          pageSize:5
        }).then(function(response) {
          // console.log(response);
          let listArray = response.data.data.list;
          _this.data3 = listArray;
          _this.total = response.data.data.total;
          _this.value1 = '', _this.value2 = ''
        });
      },
      // 分页
      handleCurrentChange: function (val) {
        let _this = this;
        checkStatus(_this)
        let url = familyDoctor()
        if (!_this.search) {
          axios.post(url + "/wcfy/zytj/selectSchools" + "?loginId=" + _this.loginId + "&token=" + _this.token,
            {
              pageNum: val,
              pageSize: 5,
              searchKey: ''
            }).then(function (response) {
            _this.data3 = response.data.data.list
            _this.total = response.data.data.total
          })
        } else {
          axios.post(url + "/wcfy/zytj/selectSchools" + "?loginId=" + _this.loginId + "&token=" + _this.token,
            {
              pageNum: val,
              pageSize: 5,
              searchKey: _this.search
            }).then(function (response) {
            _this.data3 = response.data.data.list;
            _this.total = response.data.data.total;
          });
        }
      },
      // 搜索
      Search: function () {
        let _this = this;
        checkStatus(_this);
        let url = familyDoctor();
        axios.post(url + "/wcfy/zytj/selectSchools" + "?loginId=" + _this.loginId + "&token=" + _this.token, {
          pageNum: 1,
          searchKey: _this.search,
          pageSize: 5
        }).then(function (response) {
          _this.total = response.data.data.total
          _this.data3 = response.data.data.list;
        });
        // let s = _this.$refs.checkboxs;
        // checobox(s);
      },
      //学校创建
      // createsc() {
      //   console.log("sdas");
      //   let _this = this;
      //   checkStatus(_this);
      //   let url = familyDoctor();
      //   axios.post(url + "" + _this.loginId + "&token=" + _this.token, {}).then(function (response) {
      //     this.$message({
      //       type: 'success',
      //       message: response.data.message
      //     })
      //   })
      //
      // },
      //班级创建
      // createclass() {
      //   console.log("sdas");
      //   let _this = this;
      //   checkStatus(_this);
      //   let url = familyDoctor();
      //   axios.post(url + "" + _this.loginId + "&token=" + _this.token, {}).then(function (response) {
      //     this.$message({
      //       type: 'success',
      //       message: response.data.message
      //     })
      //   })
      // },
      //开启收费
      startprice() {

      },

    },

    computed: {
      familyDoctor,
      checkStatus
    },

  };
</script>
<style scoped>
  .xiao {
    display: inline-block;
  }

  .zhong {
    display: inline-block;
  }

  .da {
    display: inline-block;
  }

  .xiaoban {
    width: 175px;
    height: 220px;
    background-color: white;
    border-radius: 5px;
    text-align: center;
    display: inline-block;
    margin-left: 15px;
    margin-top: 15px;
    box-shadow: 0 1px 3px rgba(193, 188, 188, .3);
  }

  .topdiv {
    background-color: #fb8ca6;
    height: 7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .closediv {
    text-align: right;
    padding-right: 6px;
  }

  .banji {
    background-color: #fb8ca6;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    line-height: 70px;
    font-size: 18px;
    margin-left: 28.5%;
    color: white
  }

  .leftdiv {
    width: 45%;
    display: inline-block;
    border-right: 1px solid #dedede;
    cursor: pointer;
  }

  .rightdiv {
    width: 45%;
    display: inline-block;
    cursor: pointer;
    position: relative;
  }

  .upload-demo {
    position: absolute;
    left: 0;
  }

  .caozuodiv {
    margin-left: 8px;
    margin-right: 8px;
    border-top: 1px solid #dedede;
    padding-top: 5px;
    margin-top: 10px
  }

  .icon-cuowuguanbi- {
    color: #dedede;
    cursor: pointer;
  }

  .icon-sousuo {
    font-size: 20px;
  }

  .icon-shangchuan {
    font-size: 20px;
    color: #fb8ca6;
  }

  .topdivz {
    background-color: #94e2ff;
    height: 7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .banjiz {
    background-color: #94e2ff;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    line-height: 70px;
    font-size: 18px;
    margin-left: 28.5%;
    color: white
  }

  .topdivd {
    background-color: #7cfdc8;
    height: 7px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .banjid {
    background-color: #7cfdc8;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    line-height: 70px;
    font-size: 18px;
    margin-left: 28.5%;
    color: white
  }

  .bottom {
    text-align: center;
    height: 50px;
    width: 100%;
    padding-top: 10px;
  }

  .price {
    background-color: #0185ff;
    width: 150px;
    height: 40px;
    color: white;
    border: 0;
    border-radius: 5px;
    margin-right: 30px;
  }

  .save {
    background-color: #fb8ca6;
    width: 150px;
    height: 40px;
    color: white;
    border: 0;
    border-radius: 5px;
  }

  button {
    outline: none;
    cursor: pointer;
  }
  .overScroll{
    overflow-y: hidden;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  .test {
    width: 100%;
    height: 70px;
    margin-top: 10px;
    white-space: nowrap;
  }

  .test li {
    display: inline-block;
    height: 70px;
    line-height: 70px;
    text-align: center;
    white-space: nowrap;
    font-size: 14px;
    color: #fb8ca6;
    background-color: #ffffff;
    margin-right: 2px;
    width: 110px;
  }

  /*.test li:nth-of-type(1) {*/
    /*width: 10%;*/
  /*}*/

  /*.test li:nth-of-type(2) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(3) {*/
    /*width: 10%;*/
  /*}*/

  /*.test li:nth-of-type(4) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(5) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(6) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(7) {*/
    /*width: 12%;*/
  /*}*/

  /*.test li:nth-of-type(8) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(9) {*/
    /*width: 9%;*/
  /*}*/

  /*.test li:nth-of-type(10) {*/
    /*width: 12%;*/
  /*}*/

  .zengzhi1 {
    height: 25px;
    line-height: 25px;
    border-bottom: 1px solid #fb8ca6;
  }

  .zengzhi2 {
    height: 25px;
    line-height: 24px;
  }

  .zengzhi3 {
    line-height: 50px
  }

  .zz {
    display: block;
    float: left;
    width: 24%;
    border-right: 1px solid #fb8ca6;
  }

  .zz1 {
    display: block;
    float: left;
    width: 28%;
    border-right: 1px solid #fb8ca6;
  }

  .zz2 {
    display: block;
    float: left;
    width: 23%;
  }

  .miandiv {
    background-color: rgba(150, 152, 150, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    margin: 0;
    z-index: 2001;
  }

  .miandiv1 {
    background-color: rgba(150, 152, 150, 0.8);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    margin: 0;
    z-index: 4001;
  }

  .contantdiv {
    position: absolute;
    top: 15%;
    width: 80%;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    box-sizing: border-box;
    margin-bottom: 50px;
  }

  .contantdiv1 {
    position: absolute;
    top: 2%;
    height: 600px;
    left: 50%;
    transform: translateX(-50%);
  }

  .icon-cuowu {
    font-size: 18px;
    color: #BBBBBB
  }

  .icon-queding {
    font-size: 18px;
  }

  .icon-zuoxuanzhuan {
    font-size: 40px
  }

  .icon-youxuanzhuan {
    font-size: 40px
  }

  .icon-tu_pian {
    font-size: 25px !important;
  }

  .tupian {
    width: 800px;
    height: 300px;
  }

  .el-date-editor.el-input {
    width: 228px;
  }

  .spacesp {
    display: inline-block;
    width: 97%;
    height: 15px;
  }

  .shop_picture {
    width: 590px;
    height: 300px;
    margin-left: 2%;
  }

  .shop_pic {
    width: 100%;
    height: 300px;
  }

  .shop_thumbnail {
    display: flex;
    margin-left: 2%;
    padding-bottom: 2%
  }

  .thu {
    width: 100px;
    height: 100px;
    border: 1px solid #dfdfdf;
    margin-top: 5px;
    margin-right: 5px;
    display: inline-block;
  }

  .thu img {
    width: 100px;
    height: 100px;
  }

  #cramerid >>> .el-dialog--small {
    width: 55%;
    height: 500px;
  }

  /*之前的*/
  .goschool-nav {
    height: 70px;
    position: relative;
    background-color: white;
  }

  .nav-date {
    height: 70px;
  }

  .nav-date .el-button--text {
    height: 50px;
    width: 147px;
    padding: 0;
    color: white;
    font-size: 14px;
    margin-top: 10px;
    margin-left: 20px;
    background-color: #fb8ca6;
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

  .listhead li:nth-of-type(1) {
    width: 28%;
  }

  .listhead li:nth-of-type(2) {
    width: 18%;
  }

  .listhead li:nth-of-type(3) {
    width: 18%;
  }

  .listhead li:nth-of-type(4) {
    width: 18%;
  }

  .listhead li:nth-of-type(5) {
    width: 17%;
    cursor: pointer;
  }

  /*.listhead li:nth-of-type(6){*/
  /*width: 15%;*/

  /*}*/
  /*.listhead li:nth-of-type(6){*/
  /*width: 15%;*/
  /*margin-right:0;*/
  /*cursor: pointer;*/
  /*}*/
  .Sure, .Return {
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

  #make > div {
    margin-left: 39px;
    margin-top: 22px;
    position: absolute;
  }

  .tick {
    height: 162px;
    width: 5%;
    margin-left: 1%;
    float: left;
    background-color: white;
    text-align: center;
  }

  #set_time {
    width: 230px;
    height: 27px;
  }

  #tick > div > div.el-dialog__body > div:nth-child(2) {
    margin-top: 20px
  }

  .text_phone {
    text-align: left;
  }

  .text_phone > span {
    margin-right: 10px;
    margin-left: 2px;
  }

  .text_intro p {
    width: 60.14px;
    float: left;
  }

  .text_intro p:last-of-type {
    line-height: 23px
  }

  .text_intro textarea {
    width: 208px;
    resize: none;
    padding: 3px 10px;
    border-color: #bfcbd9
  }

  .el-button--primary {
    float: left
  }
</style>
