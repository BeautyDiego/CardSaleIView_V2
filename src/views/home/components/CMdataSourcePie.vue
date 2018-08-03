<template>

    <div style="width:100%;height:306px;" id="CMPieId"></div>

</template>

<script>
import echarts from 'echarts';

export default {
    name: 'CMdataSourcePie',
    props:{
        CMPieDataSource: {
            type: Array,
            default: function () {
                return []
            }
        },
    },
    data () {
        return {}
    },
    watch:{
        CMPieDataSource(curVal,oldVal){
            this.initEchats();
        }
    },
    mounted () {

    },
    methods:{
        initEchats(){

                var CMdataSourcePie = echarts.init(document.getElementById('CMPieId'));
                let colorArr = ['#9bd598','#fdd961','#0386b1'];
                let seriesData = [];
                let legendData=[];
                let len=this.CMPieDataSource.length;
                for (let i = 0; i < len; i++) {
                    let item=this.CMPieDataSource[i];
                    if (item.SimStatus){
                        seriesData.push({
                            name:item.SimStatus,
                            value:item.CountNum,
                        });
                        legendData.push(item.SimStatus);
                    }

                }
                let optionCM = {
                    title : {
                        show:true,//显示策略，默认值true,可选为：true（显示） | false（隐藏）
                        text: '中国移动',//主标题文本，'\n'指定换行
                        x:'center',//水平安放位置，默认为'left'，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
                        y: 'top',//垂直安放位置，默认为top，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
                        backgroundColor: 'rgba(0,0,0,0)',//标题背景颜色，默认'rgba(0,0,0,0)'透明
                        borderColor: '#ccc',//标题边框颜色,默认'#ccc'
                        borderWidth: 0,//标题边框线宽，单位px，默认为0（无边框）
                        padding: 5,//标题内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距
                        itemGap: 10,//主副标题纵向间隔，单位px，默认为10
                        textStyle: {//主标题文本样式{"fontSize": 18,"fontWeight": "bolder","color": "#333"}
                            fontFamily: 'Arial, Verdana, sans...',
                            fontSize: 12,
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                        },
                        zlevel: 0,//一级层叠控制。默认0,每一个不同的zlevel将产生一个独立的canvas，相同zlevel的组件或图标将在同一个canvas上渲染。zlevel越高越靠顶层，canvas对象增多会消耗更多的内存和性能，并不建议设置过多的zlevel，大部分情况可以通过二级层叠控制z实现层叠控制。
                        z: 6,//二级层叠控制，默认6,同一个canvas（相同zlevel）上z越高约靠顶层。
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        data: legendData
                    },
                    color:['#62d1de','#54d6b6','#a6db69','#ffd454','#ffa361','#d1d1d1'],
                    series: [
                        {
                            name: 'SIM卡数量',
                            type: 'pie',
                            radius: '66%',
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
                 CMdataSourcePie.setOption(optionCM);
                window.addEventListener('resize', function () {
                    CMdataSourcePie.resize();
                });
        },
        async getGroupStatic(){

        },
    }
};
</script>
