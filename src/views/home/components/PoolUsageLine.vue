<template>
    <div style="width:100%;height:300px;" id="PoolLine"></div>

</template>

<script>
import echarts from 'echarts';
import {getPoolUsageLine} from './../../../api/getData'

export default {
    name: 'poolUsageLine',
    data () {
        return {
            lineDataSource:[],
        }
    },
    mounted () {
        this.getLineStatic();
    },
    methods:{
        initEchats(){
            var poolUsageLine = echarts.init(document.getElementById('PoolLine'));
            let len= this.lineDataSource.length;
            let seriesDataTotal = [];
            let seriesDataLeft = [];
            let seriesDataUsed = [];
            let xAxisData=[];
            for (let i = 0; i < len; i++) {
                let item=this.lineDataSource[i];
                xAxisData.push(item.PoolNum);
                seriesDataTotal.push(item.PoolFlowSize/(1024*1024));
                seriesDataLeft.push(((item.PoolFlowSize-item.UsedFlowMonth)/(1024*1024)).toFixed(2));
                seriesDataUsed.push((item.UsedFlowMonth/(1024*1024)).toFixed(2));

            }
            let option = {
                color: ['#003366', '#4cabce', '#e5323e'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['总流量', '剩余', '已使用']
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        axisLabel: {
                            interval:0,
                            rotate:20
                        },
                        data: xAxisData,
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '总流量',
                        type: 'bar',
                        barGap: 0,
                        data: seriesDataTotal
                    },
                    {
                        name: '剩余',
                        type: 'bar',
                        data: seriesDataLeft
                    },
                    {
                        name: '已使用',
                        type: 'bar',
                        data: seriesDataUsed
                    }
                ]
            };
                 poolUsageLine.setOption(option);
                window.addEventListener('resize', function () {
                    poolUsageLine.resize();
                });
        },
        async getLineStatic(){
            this.lineDataSource = await getPoolUsageLine();
            this.initEchats()
        },
    }
};
</script>
