<template>
    <div style="width:100%;height:306px;" :id="FlowId"></div>
</template>

<script>
import echarts from 'echarts';
import {getFlowUsagePie} from './../../../api/getData'

export default {
    name: 'flowUsagePie',
    props:{
        pieDataSource: {
            type: Object,
            default: function () {
                return {}
            }
        },
        FlowId: {
            type: String,
            default: 'FlowId'
        },
    },
    data () {
        return {}
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
                var flowUsagePie = echarts.init(document.getElementById(this.FlowId));
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
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: legendData
                    },
                    series: [
                        {
                            name: '流量数',
                            type: 'pie',
                            radius: '66%',
                            center: ['50%', '60%'],
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
                flowUsagePie.setOption(option);
                window.addEventListener('resize', function () {
                    flowUsagePie.resize();
                });
        },
        async getGroupStatic(){
            let res = await getFlowUsagePie({Res_OperatorId:4});
            this.pieDataSource = res[0];
            console.log( this.pieDataSource)
            this.initEchats()
        },
    }
};
</script>
