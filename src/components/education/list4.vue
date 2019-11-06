<template>
    <div class="contents">
        <div class="head_navs">
            <div class="search_btn">
                <input type="text" class="hx" placeholder="请扫描二维码" v-model="search" @keyup.enter="submit">
            </div>
            <div class="search_date">
                <el-date-picker
                        v-model="value1"
                        type="date"
                        placeholder="选择日期">
                </el-date-picker>
                <span>至</span>
                <el-date-picker
                        v-model="value2"
                        type="date"
                        placeholder="选择日期">
                </el-date-picker>
                <div @click="Serach">查询</div>
            </div>
        </div>

        <div class="content">
            <ul class="listhead">
                <li>姓名</li>
                <li>年龄</li>
                <li>监护人</li>
                <li>手机号码</li>
                <li>预约课程</li>
                <li>班级</li>
                <li>课时</li>
                <!--<li>操作</li>-->
            </ul>
            <ul class="listhead font_color" v-for="(item,index) in data3">
                <li>{{item.babyName}}</li>
                <li>{{item.babyAge}}岁</li>
                <li>{{item.guardianName}}</li>
                <li>{{item.guardianPhone}}</li>
                <li>{{item.gradeName}}</li>
                <li>{{item.className}}</li>
                <li>{{item.remaCourseNum}}/{{item.totalCourseNum}}</li>
                <!--<li @click="">核销</li>-->
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



        <div class="hx_card">
            <el-dialog
                    title="课程核销"
                    :visible.sync="dialogVisibles"
                    width="30%"
                    >
                <div class="hx_content">
                    <div class="baby_info">
                        <div>
                            <p>姓名</p>
                            <span>{{order.babyName}}</span>
                        </div>
                        <div>
                            <p>监护人</p>
                            <span>{{order.guardianName}}</span>
                        </div>
                        <div>
                            <p>年龄</p>
                            <span>{{order.babyAge}}月</span>
                        </div>
                        <div>
                            <p>手机号</p>
                            <span>{{order.guardianPhone}}</span>
                        </div>
<!--                        <div>-->
<!--                            <p>班级</p>-->
<!--                            <span>A班</span>-->
<!--                        </div>-->
                    </div>
                    <div>
                        <ul class="lists_data">
                            <li :class="item.courseStatus==2?'used':'wait_use'" v-for="(item,index) in data_list">

                                <div v-if="item.courseStatus==1">待使用</div>
                              <div v-else-if="item.courseStatus==2">
                                <div>已使用</div>
                                <div>{{item.createTime}}</div>
                              </div>
                            </li>

                        </ul>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibles = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibles = false;hexiao()">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import {getLastDate,familyDoctor} from "./../../common/util.js"
    export default {
        name: "课程核销",
        data() {
            return {
                total: 0,
                id: "",
                token: "",
                loginId: "",
                search: "",
                data3: [],
                dialogVisibles: false,//核销
                value1:'',//日期
                value2:"",
                url:familyDoctor(),
                data_list:"",
                order:""
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
                axios.post(that.url+"/wcfy/sys/order/courseCancelList?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:val,
                        pageSize:10
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.data3=response.data.page.records
                        that.total=response.data.page.total
                    }
                })
            },
            requestData(){
                var that=this
                axios.post(that.url+"/wcfy/sys/order/courseCancelList?loginId="+that.loginId+"&token="+that.token,
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
                      that.data3=response.data.page.records
                        that.total=response.data.page.total
                    }
                })
            },
            //搜索
            Serach(){
                var that=this
                let begindate = getLastDate(that.value1);
                let enddate = getLastDate(that.value2);
                if(begindate==""||enddate==""){
                    this.dialogVisible = true
                    this.$message("请选择查询条件")
                    return
                }
                axios.post(that.url+"/wcfy/sys/order/courseCancelList?loginId="+that.loginId+"&token="+that.token,
                    {
                        pageNum:1,
                        pageSize:10,
                        beginDate:begindate,
                        endDate:enddate,
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                      that.data3=response.data.page.records
                        that.total=response.data.page.total
                    }
                })
            },
            submit(){
                let that=this
                axios.post(that.url+"/wcfy/sys/order/cancelVerificationCourse?loginId="+that.loginId+"&token="+that.token,
                    {
                        courseNo:that.search
                    }).then(function(response){
                    if(response.data.code==500){
                        that.$message({
                            type:'error',
                            message:response.data.msg
                        })
                    }else{
                        that.order=response.data.order
                        that.data_list=response.data.list
                        that.dialogVisibles = true
                    }
                })

            },

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
        justify-content: space-between;
        padding-right: 30px;
    }
    .hx{
        height: 35px;
        margin-left: 30px;
        width: 150px;
        border: 1px solid #bfcbd9;
        padding-left: 20px;
        border-radius: 5px;
    }
    .hx:focus{
        outline: none;
        border:1px solid #20a0ff;
    }
    .search_date{
        display: flex;
        align-items: center;
    }
    .search_date span{
        font-size: 16px;
        margin: 0 10px;
    }
    .search_date>>>.el-input__inner{
        width: 300px!important;
    }
    .search_date>div:nth-of-type(3){
        color: white;
        background-color: #20a0ff;
        font-size: 16px;
        text-align: center;
        width: 60px;
        height: 36px;
        line-height: 36px;
        margin-left: 10px;
        border-radius: 5px;
        cursor: pointer;
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

    .listhead li:nth-of-type(1), .listhead li:nth-of-type(2) ,.listhead li:nth-of-type(3){
        width: 12%;
    }

    .listhead li:nth-of-type(4) {
        width: 16%;
    }
    .listhead li:nth-of-type(5){
        width: 16%;
    }
    .listhead li:nth-of-type(6){
        width: 16%;
    }
    .listhead li:nth-of-type(7) {
        width: 14.5%
    }

    .listhead li:nth-of-type(8) {
        width: 11%;
        cursor: pointer;
        color:#fb8ca6 ;
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

.baby_info{
    display: flex;
    flex-wrap: wrap;
    }
    .baby_info>div{
        display: flex;
        align-items: center;
        padding: 5px 0;
        width: 50%;
    }
    .hx_content{
        padding: 0 40px;
    }
    .baby_info>div p{
        width: 60px;
    }
    .baby_info{
        margin-bottom: 20px;
    }
.lists_data{
    display: flex;
    flex-wrap: wrap;
}
    .lists_data li{
        border-radius: 10px;
        width:23%;
        height: 110px;
        margin-bottom: 1%;
        margin-right: 1%;
    }
.used{

    background-color: #fff;

    border: solid 1px #bbbbbb;
}
.used>div>div:nth-of-type(1){
    font-size: 26px;
    letter-spacing: 1px;
    text-align: center;
    height: 60px;
    line-height: 60px;
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
}
.wait_use div{
    color:#fb8ca6 ;
    font-size: 26px;
    font-weight: bold;
    text-align: center;
}
    .el-date-editor.el-input{
        margin-bottom: 0;
    }

</style>
