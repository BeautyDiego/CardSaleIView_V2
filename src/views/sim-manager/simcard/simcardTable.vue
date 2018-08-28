<style>

    .simcardTable {
        padding: 10px;
        min-height: 600px;
    }

</style>

<template>

    <div class="simcardTable">
        <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
            <Row>
                <!-- <RadioGroup v-model="searchForm.CardTypeText" type="button" size="large"  @on-change='doChangeCardType' >
                   <Radio label="单卡"></Radio>
                   <Radio label="流量池成员"></Radio>
                 </RadioGroup>-->
                卡类型：
                <Select v-model="searchForm.CardType" style="width:100px" @on-change='doChangeCardType'>
                    <Option v-for="item in CardTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                运营商：
                <Select v-model="searchForm.OperType" style="width:150px" @on-change='doChangeOperType'>
                    <Option v-for="item in OperTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <!-- <RadioGroup v-model="searchForm.OperType" type="button" size="large"  @on-change='doChangeOperType' >
                  <Radio label="中国电信"></Radio>
                  <Radio label="中国移动"></Radio>
                  <Radio label="中国联通"></Radio>
                </RadioGroup>-->
                <!--<Button class="top-right-btn" size="large" icon="plus" @click="addUser">添加</Button>-->
                <Poptip width="400" title='搜索' placement="bottom-end" class="top-btn">
                    <Button type="primary" class="top-btn" size="large" icon="ios-search">搜  索</Button>
                    <div style="text-align:center" slot="content">
                        <Form ref="searchForm" :model="searchForm" :label-width="80" value=true
                              style="min-width:300px;padding-top:20px;">
                            <Row>
                                <Form-item label="SIM卡号">
                                    <Input v-model="searchForm.SimNum"></Input>
                                </Form-item>
                            </Row>
                            <Row>
                                <Form-item label="流量池编号">
                                    <Input v-model="searchForm.PoolNum"></Input>
                                </Form-item>
                            </Row>
                            <Row>
                                <Form-item label="卡状态">
                                    <Select v-model="searchForm.SimStatus" :transfer="true">
                                        <Option v-for="(item,index) in SimStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
                <Button v-if="IsAdmin" @click="importSimCard" type="warning" class="top-btn" size="large"
                        icon="ios-cloud-upload-outline">导入SIM卡
                </Button>
                <Button @click="toExcel" type="ghost" style="background-color:#fff" class="top-btn" size="large"
                        icon="archive">导出
                </Button>
                <Button @click="changeStatus" type="error" class="top-btn" size="large" icon="stats-bars"
                        v-show="this.searchForm.CardType=='1'">状态变更
                </Button>
                <Button @click="cpay" type="success" class="top-btn" size="large" icon="heart"
                        v-show="this.searchForm.CardType=='1'">套餐办理
                </Button>

            </Row>
        </div>
        <!--table-->
        <Row>
            <Table ref="SimTable" stripe size="small" :height="tableHeight" :loading="tableLoading"
                   :columns="tableColums" :data="tableData" @on-selection-change="tableDataChange"></Table>
        </Row>
        <Row>
            <Page :total="total"
                  :current="currentPage"
                  show-sizer
                  :page-size-opts="[20,50,100,200]"
                  :page-size="currentPageSize"
                  placement="top"
                  @on-page-size-change="changePageSize"
                  @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
        </Row>
        <!--&lt;!&ndash;新增编辑&ndash;&gt;-->
        <simcardForm :modalShow="formShow"
                     :modalFormTitle="formTitle"
                     :parentForm="parentForm"
                     @listenModalForm="hideModel"
                     @refreshTableList="getTableList"></simcardForm>
        <!--&lt;!&ndash;新增编辑备注&ndash;&gt;-->
        <simAddFlow :modalShow="addFlowformShow"
                    modalFormTitle="流量加油包"
                    :parentForm="parentForm"
                    @listenModalForm="hideRemarkModel"
                    @refreshTableList="getTableList"></simAddFlow>
        <!--&lt;!&ndash;新增编辑备注&ndash;&gt;-->
        <simcardImport :modalShow="importFormShow" @listenModalForm="hideImportModel"
                       @refreshTableList="getTableList"></simcardImport>
        <simBuyPkg :modalShow="BuyPkgModalShow" :parentForm="pkgParentData" @listenModalForm="hidePkgModel"
                   @refreshTableList="getTableList"></simBuyPkg>
        <div>
            <Modal
                    v-model="statusModal"
                    title="状态变更"
                    @on-ok="ok"
                    @on-cancel="cancel">
                <Select v-model="newstatus" style="width:300px">
                    <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Modal>
        </div>
    </div>


</template>

<script>
    import {simcardListPage, getSimListExcel, changeSimStatus, Res_ExpensesPagedList} from './../../../api/getData'
    import Cookies from 'js-cookie'
    import {clearObj} from './../../../libs/util';
    import simcardForm from './simcardForm.vue'
    import simcardRemark from './simcardRemark.vue'
    import simAddFlow from './simAddFlow.vue'
    import simcardImport from './simcardImport.vue'
    import simBuyPkg from './simBuyPkg.vue'
    import {baseUrl} from './../../../api/env'
    import formatter from './../../../libs/formatter'

    export default {
        name: 'simcardTable',
        components: {
            simcardForm,
            simcardRemark,
            simAddFlow,
            simcardImport,
            simBuyPkg
        },
        data() {
            return {
                tableLoading: false,//table是否在加载中
                tableColums: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
                        title: '序号',
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '组名',
                        key: 'GroupName',
                    },

                    {
                        align: 'center',
                        title: 'SIM卡号',
                        key: 'SimNum',
                        render: (h, params) => {
                            let actions = [];

                            actions.push(h('a', {

                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.checkSIM(params.row)
                                    }
                                }
                            }, params.row.SimNum));

                            return h('div', actions);
                        }
                    },
                    {
                        align: 'center',
                        title: '卡状态',
                        key: 'SimStatus',
                        render: (h, params) => {
                            const row = params.row;
                            const color = formatter.simStatusColor(row.SimStatus);
                            const text = row.SimStatus;
                            return h('Tag', {
                                props: {
                                    type: 'border',
                                    color: color
                                }
                            }, text);
                        }
                    },
              {
                        align: 'center',
                        title: '运营商',
                        key: 'OperType',
                        render: (h, params) => {
                            const row = params.row;
                             let operName = formatter.operName(row.OperType);
                            const color = formatter.operNameColor(operName);
                            return h('Tag', {
                                props: {
                                    type: 'dot',
                                    color: color
                                }
                            }, operName);
                        }
                    },
                    {
                        align: 'center',
                        title: '所属企业',
                        key: 'Company',
                    },
                    {
                        align: 'center',
                        title: '包含流量',
                        key: 'MonthFlow', render: (h, params) => {
                        return (params.row.MonthFlow / 1024) + 'MB';
                    }
                    },
                    {
                        align: 'center',
                        title: '已用流量',
                        key: 'NowFlow', render: (h, params) => {
                        return (params.row.NowFlow / 1024).toFixed(2) + 'MB';
                    }
                    },
                    {
                        align: 'center',
                        title: 'ICCUID',
                        key: 'ICCUID',
                    },
                    {
                        align: 'center',
                        title: '套餐名',
                        width: 200,
                        key: 'PkgName',
                    },
                    {
                        align: 'center',
                        title: '生效时间',
                        width: 170,
                        key: 'EffDate',
                    },
                ],
                tableData: [],
                tableHeight: 600,
                total: 0,
                currentPage: 1,
                currentPageSize: 20,
                formShow: false,
                formTitle: '添加用户',
                parentForm: {
                    Id: '',
                    Cus_Name: '',
                    LoginName: '',
                    Cus_Address: '',
                    Industry: '',
                    Region: '',
                    ManagerName: '',
                    ManagerEmail: '',
                    ManagerMobile: '',
                    Remark: '',
                    Admin_GroupId: '',
                    Agent_GroupId: '',
                    Customer_GroupId: '',
                },
                pkgParentData: {
                    operType: '1',
                    selectSims: [],
                    maxFlow: 0,
                },
                searchForm: {
                    SimStatus: '全部',
                    PoolNum: '',
                    SimNum: '',
                    CardType: '1',//1是单卡，2是流量池成员
                    rows: 20,
                    page: 1,
                    OperType: '1'
                },
                SimStatusList:[{value:'全部',label:'全部'},{value:'活卡待激活',label:'活卡待激活'},{value:'在用',label:'在用'},{value:'停机',label:'停机'}],

                addFlowformShow: false,//修改备注窗体
                importFormShow: false, //导入窗体
                BuyPkgModalShow: false,//续费窗体
                selectedRows: [],
                statusModal: false,
                statusList: [
                    {
                        value: '1',
                        label: '激活'
                    },
                    {
                        value: '2',
                        label: '停机'
                    },
                    {
                        value: '3',
                        label: '复机'
                    },
                    {
                        value: '4',
                        label: '数据关闭'
                    },
                    {
                        value: '5',
                        label: '数据开启'
                    }
                ],
                newstatus: '',
                CardTypeList: [
                    {
                        value: '1',
                        label: '单卡'
                    },
                    {
                        value: '2',
                        label: '流量池'
                    }
                ],
                OperTypeList: [
                    {
                        value: '1',
                        label: '中国电信'
                    },
                    {
                        value: '2',
                        label: '中国移动'
                    },
                    {
                        value: '3',
                        label: '中国联通'
                    },
                ],
            }
        },
        computed: {
            IsAdmin: function () {
                return Cookies.get('roleName') === '管理员';
            },

        },
        created() {
            this.tableHeight = window.innerHeight * 0.6;
            let vm = this;
            window.addEventListener('resize', function () {
                vm.tableHeight = window.innerHeight * 0.6
            });
        },
        mounted() {
            this.getTableList();
        },
        methods: {
            resetSearch() {
                this.searchForm.PoolNum = '';
                this.searchForm.SimNum = '';
                this.searchForm.SimStatus = '全部';
            },
            doSearchTableList() {
                this.currentPage = 1;
                this.getTableList();
            },
            async getTableList() {
                this.tableLoading = true;
                this.searchForm.page = this.currentPage;
                this.searchForm.rows = this.currentPageSize;
                const params = this.searchForm;
                const res = await simcardListPage(params);
                this.total = res.total;
                this.tableData = res.rows;
                this.tableLoading = false;
            },
            async getPkgList() {

                const res = await Res_ExpensesPagedList({
                    'page': 1,
                    'rows': '1000',
                    'OperType': this.searchForm.OperType
                });
                //this.total = res.total;
                this.pkgData = res.rows;
                //console.log('pkgData:'+this.pkgData);
                //this.tableLoading=false;
            },
            changeCurrentPage(num) {
                this.currentPage = num;
                this.getTableList();
            },
            changePageSize(pageSize) {
                this.currentPageSize = pageSize;
                this.getTableList();
            },
            checkSIM(row) {
                this.parentForm = JSON.parse(JSON.stringify(row));
                this.formTitle = '查看详情';
                this.formShow = true;
            },
            addFlow(row) {
                this.parentForm = JSON.parse(JSON.stringify(row));
                this.addFlowformShow = true;
            },
            importSimCard() {
                this.importFormShow = true;
            },
            hideModel() {
                this.formShow = false;
            },
            hideRemarkModel() {
                this.addFlowformShow = false;
            },
            hideImportModel() {
                this.importFormShow = false;
            },
            hidePkgModel() {
                this.BuyPkgModalShow = false;
            },
            doChangeCardType() {
                this.currentPage = 1;
                this.getTableList();
            },
            doChangeOperType() {
                this.currentPage = 1;
                this.searchForm.SimStatus = '全部';
                if (this.searchForm.OperType==1){ //电信
                    this.SimStatusList = [{value:'全部',label:'全部'},{value:'活卡待激活',label:'活卡待激活'},{value:'在用',label:'在用'},{value:'停机',label:'停机'}];

                }else if (this.searchForm.OperType==2){//移动
                    this.SimStatusList =  [{value:'全部',label:'全部'},{value:'测试期',label:'测试期'},{value:'沉默期',label:'沉默期'},{value:'库存期',label:'库存期'},{value:'正使用',label:'正使用'},{value:'停机',label:'停机'},{value:'预约销户',label:'预约销户'},{value:'销户',label:'销户'},];
                } else{
                    this.SimStatusList=[];
                }
                this.getTableList();
               
            },
            async toExcel() {
                const params = this.searchForm;
                const res = await getSimListExcel(params);
                if (res.success) {
                    const url = baseUrl + "/excel/" + res.filename;
                    window.open(url);
                } else {

                }
            },
            changeStatus() {
                if (this.selectedRows.length == 0) {
                    this.$Message.error('请选择至少一张SIM卡。');
                } else {
                    this.statusModal = true;
                }
            },
            cpay() {
                if (this.selectedRows.length == 0) {
                    this.$Message.error('请选择至少一张SIM卡。');
                } else {
                    let totalSimFlow = this.selectedRows.map((v, i, a) => {
                        return v.MonthFlow
                    });
                    var max = Math.max.apply(null, totalSimFlow);
                    this.pkgParentData.maxFlow = max;
                    this.pkgParentData.operType = this.searchForm.OperType;
                    this.BuyPkgModalShow = true;
                }
            },
            async ok() {
                const res = await changeSimStatus({simcards: this.selectedRows, 'newStat': this.newstatus});
                if (res.success) {
                    this.$Notice.success({
                        title: '提交申请成功',
                        duration: 8,
                        desc: res.msg
                    });
                    this.$emit('listenModalForm');
                } else {
                    this.$Notice.error({
                        title: '失败',
                        duration: 8,
                        desc: res.msg
                    });
                }
            },
            cancel() {
                //this.$Message.info('Clicked cancel');
            },
            tableDataChange(selection) {
                this.selectedRows = selection;
                this.pkgParentData.selectSims = selection;
            },
        }
    }

</script>
