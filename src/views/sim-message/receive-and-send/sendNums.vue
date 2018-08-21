<style scoped>

</style>

<template>

    <div>

        <Modal
                v-model="IsModalShow"
                title="sim卡号"
                :mask-closable="false"
                @on-cancel="cancel"
                width="780">
            <Row>
                <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
            </Row>
            <div slot="footer">
                <Button type="ghost"  @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import {getSimSendingStatus} from './../../../api/getData'
    export default {
        props: {
            checkNumId: {
                type: Number,
                default: 0
            },
            modalShow: {
                type: Boolean,
                default: true,
            }
        },
        data () {
            return {
                IsModalShow: false,
                modalForm_loading: false,
                tableColums: [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号',
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '号码',
                        key: 'SimNum',
                    },
                    {
                        align: 'center',
                        title: '发送状态',
                        key: 'SendStatus',
                    },
                    {
                        align: 'center',
                        title: '发送描述',
                        key: 'SendDesc',
                    },
                    {
                        align: 'center',
                        title: '发送时间',
                        key: 'SendTime',
                    },
                    {
                        align: 'center',
                        title: '接收时间',
                        key: 'ReceiveTime',
                    }
                ],
                tableData:[],
            }
        },
        watch: {
            modalShow(curVal, oldVal) {
                this.IsModalShow = curVal;
                if (curVal){
                    this.getSimSendingStatus();
                }
            }
        },
        created () {
        },
        mounted () {

        },
        methods: {
            cancel () {
                this.$emit('listenModalForm');
            },
            async getSimSendingStatus(){
                let res = await getSimSendingStatus({Id:this.checkNumId})
                if(res.success){
                    this.tableData=res.result
                }else{
                    this.tableData=[];
                }
            }
        }
    }

</script>
