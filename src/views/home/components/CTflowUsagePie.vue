<template>
    <div style="height:300px;">
        <Row>
            <div style="text-align: center;line-height:50px;vertical-align:middle;">
                    <span style="color:#82879d;font-size: 18px;vertical-align:middle;display:inline-block;">中国电信</span>
                    <span style="color:#82879d;font-size: 30px;vertical-align:middle;display:inline-block;padding:0 10px;">{{pkgFlow}}</span>  
                    <span style="color:#0db9c0;vertical-align:middle;display:inline-block;">总流量(GB)</span>   

            </div>
             <div style="width:100%;height:200px;" :id="FlowId"></div>
        </Row>
        <Row style="height:80px;">
            <Col :md="12" :lg="12" style="text-align:center;border-top:1px solid #eee;height:80px;padding:10px 0;">
                <p style="color:#82879d;font-size: 30px;">{{usedFlow}}</p>
                <p style="color:#82879d;">流量使用情况(GB)</p>
            </Col>
            <Col :md="12" :lg="12" style="text-align:center;border-top:1px solid #eee;border-left:1px solid #eee;height:80px;padding:10px 0;">
                <p style="color:#f14676;font-size: 30px;">{{usedRatio}}</p>
                <p style="color:#82879d;">流量使用占比</p>
            </Col>
        </Row>

    </div>

</template>

<script>
import echarts from 'echarts';

export default {
    name: 'CTflowUsagePie',
    props:{
        pieDataSource: {
            type: Object,
            default: function () {
                return {}
            }
        },
        FlowId:{
            type: String,
            default: 'FlowId'
        }
    },
    data () {
        return {}
    },
    computed:{
        pkgFlow:function () {
            if (this.pieDataSource.monthFlow){
                return (this.pieDataSource.monthFlow/(1024*1024)).toFixed(2)
            }else{
                return 0
            }
        },
        usedFlow:function () {
            if (this.pieDataSource.usedFlow){
                return (this.pieDataSource.usedFlow/(1024*1024)).toFixed(2)
            }else{
                return 0
            }
        },
        usedRatio:function () {
            if (this.pieDataSource.monthFlow){
                return (this.pieDataSource.usedFlow/this.pieDataSource.monthFlow*100).toFixed(2)+'%'
            }else{
                return 0+'%'
            }
        }
    },
    watch:{
        pieDataSource(curVal,oldVal){
            this.initEchats();
        }
    },
    mounted () {

    },
    methods:{
        initEchats(){
                var CTflowUsagePie = echarts.init(document.getElementById(this.FlowId));
                let colorArr = ['#9bd598','#fdd961','#0386b1'];
                let seriesData = [
                    {name:'已使用',
                    value:this.pieDataSource.usedFlow,
                    itemStyle: {
                                normal: {
                                    color: '#fdd961'
                                },
                            }
                     },
                    {name:'剩余量',
                        value:this.pieDataSource.monthFlow-this.pieDataSource.usedFlow,
                        itemStyle: {
                            normal: {
                                color: '#0db9c0'
                            },
                        }
                    }
                    ];
                let legendData=['已使用','剩余量'];

                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
//                    legend: {
//                        orient: 'vertical',
//                        left: 'right',
//                        data: legendData
//                    },
                    series: [
                        {
                            name: '流量数',
                            type: 'pie',
                            radius: '70%',
                            center: ['50%', '50%'],
                            data: seriesData,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                 CTflowUsagePie.setOption(option);
                window.addEventListener('resize', function () {
                    CTflowUsagePie.resize();
                });
        },
        async getGroupStatic(){

        },
    }
};
</script>
