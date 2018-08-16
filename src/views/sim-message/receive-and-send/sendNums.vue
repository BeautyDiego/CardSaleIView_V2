<style scoped>
.sim-num-item{
    text-align: center;
    border-bottom: 1px solid #e9eaec;
    line-height:40px;
}
</style>

<template>

    <div>

        <Modal
                v-model="IsModalShow"
                title="sim卡号"
                :mask-closable="false"
                @on-cancel="cancel"
                width="400">
            <Row>
                <div style="max-height: 500px;overflow-y: scroll">
                    <div v-for="(item,index) in SendNums" class="sim-num-item" :style="{'background-color':index%2 ==0?'#ebebf1':'#fff'}">
                        {{item}}
                    </div>
                </div>
            </Row>
            <div slot="footer">
                <Button type="ghost"  @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    export default {
        props: {
            SendNums: {
                type: Array,
                default: []
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
                IsTransferShow: false,
            }
        },
        watch: {
            modalShow(curVal, oldVal) {
                this.IsModalShow = curVal;
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
        }
    }

</script>
