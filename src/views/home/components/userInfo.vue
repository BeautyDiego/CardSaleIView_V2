<style lang="less">
.icon{
    display: inline-block;
    width:28px;
    height: 32px;
    position:relative;
    top:10px;
    background-image: url("./../../../images/infoIcons.png");
    background-repeat:no-repeat;
    &.user{//理解方式：直接把 & 替换成 #header

    }
    &.phone{//理解方式：直接把 & 替换成 #header
        background-position: 0 -52px;
    }
    &.status{//理解方式：直接把 & 替换成 #header
        background-position: 0 -107px;
    }
    &.level{//理解方式：直接把 & 替换成 #header
        background-position: 0 -160px;
    }
    &.durable{//理解方式：直接把 & 替换成 #header
        background-position: 0 -210px;
    }
    &.monthFlow{//理解方式：直接把 & 替换成 #header
        background-position: 0 -265px;
    }
}
    .info-title{
        color:#05b6bc;
        margin:0 10px;
    }
    .info-text{
        color:#82879d;
        margin-left:5px;
    }
</style>

<template>
    <Card :padding="0">
        <div style="padding:30px;line-height:40px;height:380px;">
            <h3 style="text-align: center;">账户信息</h3>
            <Row>
                <span class="icon user"></span><span class="info-title">用户信息:</span><span class="info-text">{{adminInfo.Name}}</span>
            </Row>
            <Row>
                <span class="icon phone"></span><span class="info-title">联系电话:</span><span class="info-text">{{adminInfo.Phone}}</span>
            </Row>
            <Row>
                <span class="icon status"></span><span class="info-title">账户状态:</span><span class="info-text">状态可用</span>
            </Row>
            <Row>
                <span class="icon level"></span><span class="info-title">账户类别:</span><span class="info-text">{{adminInfo.RoleName}}</span>
            </Row>
            <Row>
                <span class="icon durable"></span><span class="info-title">使用年限:</span><span class="info-text">{{UsageTime}}</span>
            </Row>
            <!--<Row>-->
                <!--<span class="icon monthFlow"></span><span class="info-title">平均每月使用量:</span><span style="color:#f14676;font-weight: bold;font-size: 28px;">563</span><span class="info-text">MB/月</span>-->
            <!--</Row>-->

        </div>
    </Card>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'userInfo',
    props: {
    },
    data () {
        return {

        };
    },
    computed: {
        ...mapState({
            adminInfo: state => state.user.adminInfo,
        }),
        IsAdmin: function () {
            return this.adminInfo.RoleName != "管理员";
        },
        UsageTime:function () {
            return this.TimeDifference(this.adminInfo.JoinDate)
        }
    },
    mounted(){
       console.log(this.adminInfo)
    },
    methods: {

    TimeDifference(startDate){
        var stime = Date.parse(new Date(startDate));
        var etime = Date.parse(new Date());
        var usedTime = etime - stime;  //两个时间戳相差的毫秒数
        var days=Math.floor(usedTime/(24*3600*1000));
        //计算出小时数
        var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
        var time = days + "天"+hours+"时"+minutes+"分";
        return time;
    }

    }
};
</script>

