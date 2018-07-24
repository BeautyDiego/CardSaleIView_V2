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
                <span class="icon level"></span><span class="info-title">账户等级:</span><span class="info-text">普通账户</span>
            </Row>
            <Row>
                <span class="icon durable"></span><span class="info-title">使用年限:</span><span class="info-text">一年两个月</span>
            </Row>
            <Row>
                <span class="icon monthFlow"></span><span class="info-title">平均每月使用量:</span><span style="color:#f14676;font-weight: bold;font-size: 28px;">563</span><span class="info-text">MB/月</span>
            </Row>

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
    },
    mounted(){
       console.log(this.adminInfo)
    },
    methods: {

    }
};
</script>

