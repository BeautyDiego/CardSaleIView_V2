<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <div >
            <img width="100%" src="./../../images/homeBanner.png" alt="">
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
                    <div >
                        <Row>
                            <Col :md="24" :lg="8">
                            <CTdataSourcePie
                                    v-show="CTPieDataSource.length>0"
                                    :CTPieDataSource="CTPieDataSource"></CTdataSourcePie>
                            <div v-show="CTPieDataSource.length==0" class="no-card">暂无中国电信卡</div>
                            </Col>
                            <Col :md="24" :lg="8">
                            <CMdataSourcePie v-show="CMPieDataSource.length>0"
                                    :CMPieDataSource="CMPieDataSource">
                                                         </CMdataSourcePie>
                            <div v-show="CMPieDataSource.length==0" class="no-card">暂无中国移动卡</div>
                            </Col>
                             <Col :md="24" :lg="8">
                            <CUdataSourcePie v-show="CUPieDataSource.length>0"
                                    :CMPieDataSource="CUPieDataSource">
                                                         </CUdataSourcePie>
                            <div v-show="CUPieDataSource.length==0" class="no-card">暂无中国联通卡</div>
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
                            <Col :md="24" :lg="8">
                            <CTflowUsagePie v-show="CTFlowPieSource" :pieDataSource="CTFlowPieSource"
                            ></CTflowUsagePie>
                            <div v-show="!CTFlowPieSource" class="no-card">暂无中国电信卡</div>
                            </Col>
                            <Col :md="24" :lg="8">
                            <CMflowUsagePie v-show="CMFlowPieSource" :pieDataSource="CMFlowPieSource"
                            ></CMflowUsagePie>
                            <div v-show="!CMFlowPieSource" class="no-card">暂无中国移动卡</div>
                            </Col>
                            <Col :md="24" :lg="8">
                            <CUflowUsagePie v-show="CUFlowPieSource" :pieDataSource="CUFlowPieSource"
                            ></CUflowUsagePie>
                            <div v-show="!CUFlowPieSource" class="no-card">暂无中国联通卡</div>
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
import CUdataSourcePie from './components/CUdataSourcePie.vue';
import CMflowUsagePie from './components/CMflowUsagePie.vue';
import CTflowUsagePie from './components/CTflowUsagePie.vue';
import CUflowUsagePie from './components/CUflowUsagePie.vue';
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
        CUdataSourcePie,
        CMflowUsagePie,
        CTflowUsagePie,
        CUflowUsagePie,
        PoolUsageLine,
    },
    data () {
        return {
            CMPieDataSource:[],
            CTPieDataSource:[],
            CUPieDataSource:[],
            CMFlowPieSource:{},
            CTFlowPieSource:{},
            CUFlowPieSource:{}
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
            //OperType 1 是电信  2  是移动 3联通
            this.CTPieDataSource=res.filter(function (x) {
                return x.OperType==1;
            });
            this.CMPieDataSource=res.filter(function (x) {
                return x.OperType==2;
            });
             this.CUPieDataSource=res.filter(function (x) {
                return x.OperType==3;
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
            this.CUFlowPieSource =res.filter(function (x) {
                return x.OperType==3;
            })[0];

            console.log(  this.CUFlowPieSource )

        },
    }
};
</script>
