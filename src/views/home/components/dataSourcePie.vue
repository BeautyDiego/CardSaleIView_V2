<template>
    <div style="width:100%;height:306px;" id="data_source_con"></div>
</template>

<script>
import echarts from 'echarts';
import {getSimCardGroupStatic} from './../../../api/getData'

export default {
    name: 'dataSourcePie',
    data () {
        return {
            pieDataSource:[],
        };
    },
    mounted () {
        this.getGroupStatic();
    },
    methods:{
        initEchats(){
                var dataSourcePie = echarts.init(document.getElementById('data_source_con'));
                let colorArr = ['#9bd598','#fdd961','#0386b1'];
                let seriesData = [];
                let legendData=[];
                let len=this.pieDataSource.length;
                for (let i = 0; i < len; i++) {
                    let item=this.pieDataSource[i];
                    if (item.SimStatus){
                        seriesData.push({
                            name:item.SimStatus,
                            value:item.CountNum,
                            itemStyle: {
                                normal: {
                                    color: colorArr[len-i]
                                },
                            }
                        });
                        legendData.push(item.SimStatus);
                    }

                }
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
                            name: 'SIM卡数量',
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
                dataSourcePie.setOption(option);
                window.addEventListener('resize', function () {
                    dataSourcePie.resize();
                });
        },
        async getGroupStatic(){
            this.pieDataSource = await getSimCardGroupStatic();
            this.initEchats()
        },
    }
};
</script>
