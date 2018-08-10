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
                        <Icon type="pie-graph"></Icon>
                        SIM卡总数及SIM卡状态统计
                    </p>
                    <div class="data-source-row">
                        <Row>
                            <Col :md="24" :lg="12">
                            <CTdataSourcePie :CTPieDataSource="CTPieDataSource"
                                            ></CTdataSourcePie>
                            </Col>
                            <Col :md="24" :lg="12">
                            <CMdataSourcePie :CMPieDataSource="CMPieDataSource">
                                                         </CMdataSourcePie>
                            </Col>
                        </Row>
                    </div>
                </Card>
            </Col>
        </Row>
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="16" :style="{marginBottom: '10px'}">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="arrow-graph-up-right"></Icon>
                   流量使用情况
                </p>
                <div>
                    <Row>
                        <Col :md="24" :lg="12">
                        <CTflowUsagePie :pieDataSource="CTFlowPieSource"
                        ></CTflowUsagePie>
                        </Col>
                        <Col :md="24" :lg="12">
                        <CMflowUsagePie :pieDataSource="CMFlowPieSource"
                        ></CMflowUsagePie>
                        </Col>
                    </Row>

                </div>
            </Card>
            </Col>
            <Col :md="24" :lg="8">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="stats-bars"></Icon>
                    流量池使用情况
                </p>
                <div>
                    <PoolUsageLine></PoolUsageLine>
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
import CTflowUsagePie from './components/CTflowUsagePie.vue';
import PoolUsageLine from './components/PoolUsageLine.vue';
import userInfo from './components/userInfo.vue';
import {getSimCardGroupStatic} from './../../api/getData'
import {getFlowUsagePie} from './../../api/getData'

export default {
    name: 'home',
    components: {
        userInfo,
        CTdataSourcePie,
        CMdataSourcePie,
        CMflowUsagePie,
        CTflowUsagePie,
        PoolUsageLine,
    },
    data () {
        return {
            CMPieDataSource:[],
            CTPieDataSource:[],
            CMFlowPieSource:{},
            CTFlowPieSource:{},
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
            //OperType 1 是电信  2  是移动
            this.CTPieDataSource=res.filter(function (x) {
                return x.OperType==1;
            });
            this.CMPieDataSource=res.filter(function (x) {
                return x.OperType==2;
            });


        },
        async getFlowStatic(){
            let res = await getFlowUsagePie({Res_OperatorId:4});
            this.CMFlowPieSource =res.filter(function (x) {
                return x.OperType==2;
            })[0];
            this.CTFlowPieSource =res.filter(function (x) {
                return x.OperType==1;
            })[0];

        },
    }
};
</script>
