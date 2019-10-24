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
                <span @click="dialogVisible=true">新增班级</span>
            </div>
        </div>
        <div class="lists">
            <div v-for="(item,inde) in data_list">
                <div>
                    <span>{{item.className}}</span>
                    <span>{{item.classTotalNum-item.jsList.length}}</span>/
                    <span>{{item.classTotalNum}}</span>
                    <span>预留人数</span>
                    <span>{{item.xxClassNum}}</span>
                    <span class="total_edit" @click="total_edit(item.id,item.xxClassNum,item.classTotalNum);dialogVisibles=true">编辑</span>
                    <span class="total_detel" @click="total_detel(item.id)">删除</span>
                </div>
                <ul>
                    <li v-for="(items,index) in item.jsList">
                        <div class="name">{{items.name}}</div>
                        <div class="date">{{items.date}}</div>
                    </li>
                </ul>
            </div>


        </div>


        <!--新增班级-->
        <div class="new_class">
            <el-dialog
                    title="新增班级"
                    :visible.sync="dialogVisible"
                    width="30%"
                    >
               <div class="new_add_class">
                   <p>总人数</p>
                   <el-input v-model="input" placeholder="请输入人数" maxlength="3"></el-input>
               </div>
                <div class="new_add_class">
                    <p>预留人数</p>
                    <el-input v-model="inputs" placeholder="请输入人数" maxlength="3"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false,sure_add()">确 定</el-button>
            </span>
            </el-dialog>
        </div>
        <!--xiugai -->
        <div class="new_class">
            <el-dialog
                    title="新增班级"
                    :visible.sync="dialogVisibles"
                    width="30%"
            >
                <div class="new_add_class">
                    <p>预约人数</p>
                    <el-input v-model="input" placeholder="请输入人数" maxlength="3" disabled></el-input>
                </div>
                <div class="new_add_class">
                    <p>预留人数</p>
                    <el-input v-model="inputs" placeholder="请输入人数" maxlength="3"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
             <el-button @click="dialogVisibles = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisibles = false,sure_edit()">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "班级详情",
        data(){
            return{
                data_list:"",
                total:'',
                dialogVisible:false,
                dialogVisibles:false,
                input:"",
                inputs:"",
                num:"",
                id:""
            }
        },
        created(){
            this.requestData(window.localStorage.getItem('gradeId'))
            this.num=window.localStorage.getItem('totalNum')
        },
        methods:{
            requestData(id){
                var that=this
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/class/loadClassList",
                    {
                      gradeId:id,
                    }).then(function(response){
                    that.data_list=response.data.classList;
                    that.total=response.data.total
                })
            },
            sure_add(){
                var that=this
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/class/saveNewClass",
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

                axios.post("http://gwz.premier-tech.cn/wcfy/sys/class/updateEtzjClassInfo",
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
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/class/deleteEtzjClass",
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
    .lists>div{
        font-size: 16px;
        padding-bottom: 20px;
        border-bottom: 1px solid #bbb;
    }
    .lists>div>div{
        height: 70px;
        display: flex;
        align-items: center;
    }
    .lists>div>div>span{
        margin-right: 15px;
    }
    .lists>div>div>span:nth-of-type(2){
        margin-right: 0px;
    }
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
</style>