<template>
    <div style="width:100%;">
        <div   style="width:100%;height:332px;" id="PoolLine"></div>

        <div v-show="lineDataSource.length==0" style="text-align: center;width:100%;position:absolute;top:190px;left:0"> 暂未购买流量池卡</div>
    </div>

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
            let len= this.lineDataSource.length;
            if (len>0){
                var poolUsageLine = echarts.init(document.getElementById('PoolLine'));
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
                    grid:{
                        left:'70px',
                        right:0,
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
                            type: 'value',
                            name: '单位/G',
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
            }

        },
        async getLineStatic(){
            this.lineDataSource = await getPoolUsageLine();
            this.initEchats()
        },
    }
};
</script>
