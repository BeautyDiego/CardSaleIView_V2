<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <div >
            <img width="100%" src="./../../images/homeBanner.jpg" alt="">
        </div>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="6" :style="{marginBottom: '10px'}">
             <userInfo></userInfo>
            </Col>
            <Col :md="24" :lg="18" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        SIM卡总数及SIM卡状态统计
                    </p>
                    <div class="data-source-row">
                        <Row>
                            <Col :md="24" :lg="12">
                                <CTdataSourcePie :pieDataSource="CMPieDataSource"
                                                ></CTdataSourcePie>
                            </Col>
                            <Col :md="24" :lg="12">
                                <CMdataSourcePie :pieDataSource="CTPieDataSource"
                                                ></CMdataSourcePie>
                            </Col>
                        </Row>


                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="18" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-pulse-strong"></Icon>
                   流量使用情况
                </p>
                <div class="data-source-row">
                    <CMflowUsagePie :pieDataSource="CMFlowPieSource"
                                  ></CMflowUsagePie>
                </div>
            </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import CTdataSourcePie from './components/CTdataSourcePie.vue';
import CMdataSourcePie from './components/CMdataSourcePie.vue';
import CMflowUsagePie from './components/CMflowUsagePie.vue';
import userInfo from './components/userInfo.vue';
import {getSimCardGroupStatic} from './../../api/getData'
import {getFlowUsagePie} from './../../api/getData'

export default {
    name: 'home',
    components: {
        CTdataSourcePie,
        CMdataSourcePie,
        userInfo,
        CMflowUsagePie,
    },
    data () {
        return {
            CMPieDataSource:[],
            CTPieDataSource:[],
            CMFlowPieSource:{},
        };
    },
    computed: {

    },
    created(){
        this.getGroupStatic();
        this.getFlowStatic();
    },
    methods: {
        async getGroupStatic(){
            let res = await getSimCardGroupStatic();
            this.CMPieDataSource=res.filter(function (x) {
                return x.Res_OperatorId==4;
            });
            this.CTPieDataSource=res.filter(function (x) {
                return x.Res_OperatorId==3;
            });
        },
        async getFlowStatic(){
            let res = await getFlowUsagePie({Res_OperatorId:4});
            this.CMFlowPieSource =  this.CTPieDataSource=res.filter(function (x) {
                return x.Res_OperatorId==4;
            })[0];
            console.log(this.CMFlowPieSource)
        },
    }
};
</script>
