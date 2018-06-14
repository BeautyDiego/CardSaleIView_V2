<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>
                        SIM卡总数及SIM卡状态统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import dataSourcePie from './components/dataSourcePie.vue';

export default {
    name: 'home',
    components: {
        dataSourcePie,
    },
    data () {
        return {
            count: {
                createUser: 496,
                visit: 3264,
                collection: 24389305,
                transfer: 39503498
            },
            showAddNewTodo: false,
            newToDoItemValue: ''
        };
    },
    computed: {

    },
    methods: {

    }
};
</script>
