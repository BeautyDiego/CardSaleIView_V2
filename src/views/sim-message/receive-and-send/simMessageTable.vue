<style>

    .sendMessage {
        padding: 10px;
        min-height: 600px;
    }

</style>

<template>

    <div class="sendMessage">
        <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
            <Row>
                <Col span="24">
                <Button class="top-right-btn" size="large" icon="plus" @click="addMessage">添加</Button>
                <Poptip width="400" title='搜索' placement="bottom-end" class="top-btn">
                    <Button type="primary" size="large" icon="ios-search">搜  索</Button>
                    <div style="text-align:center" slot="content">
                        <Form ref="searchForm" :model="searchForm" :label-width="80" value=true
                              style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                            <Row>
                                <Form-item label="卡号">
                                    <Input v-model="searchForm.simNum"></Input>
                                </Form-item>
                            </Row>
                            <Row>
                                <Form-item label="发送状态">
                                    <Select v-model="searchForm.sendStatus" :transfer="true">
                                        <Option v-for="item in sendStatusList" :value="item.value" :key="item.value">
                                            {{ item.label }}
                                        </Option>
                                    </Select>
                                </Form-item>
                            </Row>
                        </Form>
                        <Row>
                            <Button style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff"
                                    size="small" @click="doSearchTableList">确定
                            </Button>
                            <Button style="float:right;margin-top:10px;" size="small" @click="resetSearch">重置</Button>
                        </Row>
                    </div>
                </Poptip>
                </Col>
            </Row>
        </div>
        <!--table-->
        <Row>
            <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
        </Row>
        <Row>
            <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total
                  style="float:right;margin-top:10px"></Page>
        </Row>
        <!--新增编辑-->
        <simMessageForm :modalShow="formShow"
                        :modalFormTitle="formTitle"
                        :parentForm="parentForm"
                        @listenModalForm="hideModel"
                        @refreshTableList="getTableList"></simMessageForm>
        <!--查看号码-->
        <send-nums :modalShow="sendNumModalShow"
                   :checkNumId="checkNumId"
                   @listenModalForm="hideSendNumModal"></send-nums>
        <!--是否删除框-->
        <Modal v-model="delModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="btnLoading" @click="comfirmDel">删除</Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import Cookies from 'js-cookie'
    import {getSimMessageList, delUser, resetUserPwd} from './../../../api/getData'
    import {clearObj} from './../../../libs/util';
    import simMessageForm from './simMessageForm.vue'
    import sendNums from './sendNums.vue'

    export default {
        name: 'simMessage',
        components: {
            simMessageForm,
            sendNums
        },
        data() {
            return {
                tableColums: [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号',
                        align: 'center'
                    },
                    {
                       align: 'center',
                        title: '发送号码',
                        key: 'SendNum',
                    },
                    {
                        align: 'center',
                        title: '接收号码',
                        key: 'ReceiveNum',
                        render: (h, params) => {
                            let actions = [];
                            let simCount = params.row.ReceiveNum.split(',').length;
                            let str='';
                            if(simCount>1){
                                str=simCount + "张sim卡"
                            }else{
                                str=params.row.ReceiveNum;
                            }
                            actions.push(h('a', {
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.checkSendNum(params.row.Id)
                                    }
                                }
                            }, str));

                            return h('div', actions);
                        }
                    },
                    {
                        align: 'center',
                        title: '短信内容',
                        key: 'MsgContent',
                    },
                    {
                        align: 'center',
                        title: '任务时间',
                        key: 'SendTime',
                    },
                    {
                        align: 'center',
                        title: '发送状态',
                        key: 'SendStatus',
                        render: (h, params) => {
                            let statusTxt = '';
                            if (params.row.SendStatus == 1) {
                                statusTxt = '待发送'
                            } else if (params.row.SendStatus == 2) {
                                statusTxt = '正在发送'
                            } else if (params.row.SendStatus == 3) {
                                statusTxt = '已发送'
                            }
                            return statusTxt;
                        },
                    },
//          {
//              align:'center',
//              title: '终端接收状态',
//              key: 'ReceiveStatus',
//          },
//          {
//            title: '操作',
//            align: 'center',
//            render: (h, params) => {
//              let actions=[];
//                actions.push( h('Button', {
//                  props: {
//                    type: 'warning',
//                    size: 'small'
//                  },
//                  style: {
//                    marginRight: '5px'
//                  },
//                  on: {
//                    click: () => {
//                      this.editMessage(params.row)
//                    }
//                  }
//                }, '修改'));
//
//                actions.push(  h('Button', {
//                  props: {
//                    type: 'error',
//                    size: 'small'
//                  },
//                  style: {
//                    marginRight: '5px'
//                  },
//                  on: {
//                    click: () => {
//                      this.delMessage(params.row.Id)
//                    }
//                  }
//                }, '删除'));
//
//
//              return h('div', actions);
//            }
//          }
                ],
                tableData: [],
                total: 0,
                currentPage: 1,
                formShow: false,
                formTitle: '新建短信',
                sendNumModalShow: false,
                checkNumId: '', //所选择id
                parentForm: {
                    Id: '',
                    Cus_CustomerId: '',
                    SendType: '',
                    SendNum: '',
                    ReceiveNum: '',
                    MsgContent: '',
                    SendTime: '',
                    SendStatus: '',
                    ReceiveStatus: '',
                },
                delModal: false,
                delId: '', //删除的Id
                resetModal: false,
                resetId: '',//密码重置Id
                btnLoading: false,
                searchForm: {
                    sendStatus: -1,
                    simNum: '',
                    rows: 10,
                    page: 1,
                },
                sendStatusList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '待发送'
                    },
                    {
                        value: 2,
                        label: '正在发送'
                    }, {
                        value: 3,
                        label: '已发送'
                    }],
            }
        },
        computed: {},
        created() {

        },
        mounted() {
            this.getTableList();
        },
        methods: {
            resetSearch() {
                this.searchForm.simNum = '';
                this.searchForm.sendStatus = -1;
            },
            doSearchTableList() {
                this.currentPage = 1;
                this.getTableList();
            },
            async getTableList() {
                this.searchForm.page = this.currentPage;
                const params = this.searchForm;
                const res = await getSimMessageList(params);
                this.total = res.total;
                this.tableData = res.rows;
            },
            changeCurrentPage(num) {
                this.currentPage = num;
                this.getTableList();
            },
            addMessage() {
                clearObj(this.parentForm);
                this.formTitle = '新建短信';
                this.formShow = true;
            },
            editMessage(row) {
                this.parentForm = JSON.parse(JSON.stringify(row));
                this.formTitle = '修改用户';
                this.formShow = true;
            },
            checkSendNum(Id) {
                this.checkNumId = Id;
                this.sendNumModalShow = true;
            },
            delMessage(Id) {
                this.delId = Id;
                this.delModal = true;
            },
            async comfirmDel() {
                this.btnLoading = true;
                try {
                    const res = await delUser({Id: this.delId});
                    if (res.success) {
                        this.$Message.success('删除成功!');
                        this.getTableList();
                        this.delModal = false;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (err) {
                    console.log(err);
                    this.$Message.error('服务器异常，稍后再试');
                }
                this.btnLoading = false;
            },
            hideModel() {
                this.formShow = false;
            },
            hideSendNumModal(){
                this.sendNumModalShow = false;
            },
        }
    }

</script>
