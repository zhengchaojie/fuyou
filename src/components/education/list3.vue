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
                <li>排队名次</li>
                <li>状态</li>
            </ul>
            <ul class="listhead font_color" v-for="(item,index) in data3">
                <li>{{item.babyName}}</li>
                <li>{{item.babyAge}}岁</li>
                <li>{{item.guardianName}}</li>
                <li>{{item.guardianPhone}}</li>
                <li>{{item.gradeName}}</li>
                <li>{{item.queuedNum}}</li>
                <li v-if="item.orderStatus==1">已预约</li>
                <li v-else-if="item.orderStatus==2">排队中</li>
                <li v-else-if="item.orderStatus==3">已取消</li>
                <li v-else-if="item.orderStatus==4">待支付</li>
                <li v-else-if="item.orderStatus==5">服务中</li>
                <li v-else="item.orderStatus==6">已完成</li>
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
                            :page-size="5"
                            v-if="total <= 5 ? false:true"
                            @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </template>
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
    export default {
        name: "lits3",
        data() {
            return {
                total: 0,
                id: "",
                token: "",
                loginId: "",
                search: "",
                startDate: "",
                endDate: "",
                data3: [],
                dialogVisible: false,
                options: [{
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
            this.requestData()
        },
        methods:{
            handleCurrentChange(val){
                var that=this
                if(that.selectvalue_status!=''||that.selectvalue_kc!=''){
                    axios.post("http://gwz.premier-tech.cn/wcfy/sys/order/loadStudentOrderList",
                        {
                            pageNum:val,
                            pageSize:10,
                            orderStats:that.selectvalue_status,
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
                    axios.post("http://gwz.premier-tech.cn/wcfy/sys/order/loadAppointmentList",
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
                            that.data3=response.data.appointmentList
                            that.total=response.data.total
                        }
                    })
                }

            },
            requestData(){
                var that=this
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/order/loadAppointmentList",
                    {
                        pageNum:1,
                        pageSize:10
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
            //搜索
            Serach(){
                var that=this
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/order/loadAppointmentList",
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
                        that.data3=response.data.appointmentList
                        that.total=response.data.total
                    }
                })
            },
            select_search(){
                var that=this
                axios.post("http://gwz.premier-tech.cn/wcfy/sys/order/loadAppointmentList",
                    {
                        pageNum:1,
                        pageSize:10,
                        orderStats:that.selectvalue_status,
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
    width: 12%;
}

.listhead li:nth-of-type(4) {
    width: 20%;
}
 .listhead li:nth-of-type(5){
     width: 18.8%;
 }
.listhead li:nth-of-type(7) {
    width: 11.8%
}

.listhead li:nth-of-type(8) {
    width: 11%
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