<template>
    <div id="content">
        <div class="head_nav">班级管理</div>

        <div class="lists">
            <ul >
                <li @click="route(item)" v-for="(item,index) in data_list">
                    <p class="name">{{item.gradeName}}</p>
                    <p class="age">{{item.gradeContent}}</p>
                    <div>
                        <div class="total">
                            <span>总人数</span>
                            <span v-if="item.studentCount != '' || item.studentCount != null || item.studentCount != 'null'">{{item.studentCount}}</span>
                            <span v-else>0</span>
                        </div>
                        <div class="bj">
                            <span>班级数</span>
                            <span>{{item.classCount}}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import {familyDoctor, getLastDate2, checobox, checkStatus} from "./../../common/util.js";
    export default {
        provide () {
            return {
                reload: this.reload
            }
        },
        data (){
            return {
                isRouterAlive: true,
                data_list:" ",
                url:familyDoctor(),
                token:"",
                loginId:""
            }
        },
        created(){
            this.token = window.localStorage.getItem("token");
            this.loginId = window.localStorage.getItem("loginId");
            this.requestData()
        },
        methods: {
            //局部刷新
            reload() {
                this.isRouterAlive = false
                this.$nextTick(function () {
                    this.isRouterAlive = true
                })
            },
            //班级详情
            route(item){
                window.localStorage.setItem('gradeId',item.gradeId)//年级id
                window.localStorage.setItem('stuNum',item.studentCount) //总人数
                window.localStorage.setItem('classNum',item.classCount) //总人数
                this.$router.push({ name:'早教班级详情',params:{id:item.gradeId}})

            },
            requestData(){
                var _this=this
                axios.post(this.url+"/wcfy/sys/grade/loadGradeList"+"?loginId="+_this.loginId+"&token="+_this.token,
                    {
                        pageSize:10,
                        pageNum:1
                    }).then(function(response){
                        console.log(response)
                       _this.data_list=response.data.list;

                    })
            }
        }
    }
</script>

<style scoped>
    #content{
        background-color: #fff;
        padding:0 30px 30px;
    }
.head_nav{
    height:80px;
    display: flex;
    align-items: center;
    /*margin:0 30px;*/
    font-family: MicrosoftYaHei-Bold;
    font-size: 18px;
    border-bottom: 1px solid #bbb;
    opacity: 0.8;
    font-weight: bold;
}
    .lists ul{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 30px;
        flex-direction: row;
        height:495px;
        align-content: space-between;
    }
    .lists ul li{
        padding:20px 20px 10px;
        width: 26%;
        border: 2px solid #fb8ca6;
        height: 200px;
        cursor: pointer;
        background-color: #ffe7ed;
        border-radius: 10px;
    }
    .name{
        color: #fb8ca6;
        letter-spacing: 1px;
        font-size:30px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 30px;
    }
    .age{
        font-size: 24px;
        color: #888;
        letter-spacing: 1px;
        text-align: center;
        margin-bottom: 40px;
    }
    .lists ul li>div{
        border-top: 1px solid #bbb;
        display: flex;
    }
    .total,.bj{
       display: flex;
       align-items: center;
        width: 100%;
        margin-top:10px;
    }
    .total{
        border-right: 1px solid #bbb;
        margin-right:10px;
    }
    .total span:first-of-type,.bj span:first-of-type{
        font-size: 15px;
        color: #888;
        width: 50%;
        text-align: center;
    }
    .bj span:first-of-type{
        margin-left:10px;
    }
    .total span:last-of-type,.bj span:last-of-type{
        font-size:24px;
        color: #ff6565;
        width: 50%;
        text-align: center;
    }
</style>
