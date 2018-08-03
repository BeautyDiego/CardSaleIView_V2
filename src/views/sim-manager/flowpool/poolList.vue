<style>
  
  .poolList {
    padding:10px;
    min-height:600px;
  }
</style>

<template>
  
  <div class="poolList">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
    
           <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
                <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                  <Row>
                    <Form-item label="用户名称"  >
                      <Input v-model="searchForm.cus_Name" ></Input>
                    </Form-item>
                  </Row>
                  <Row>
                    <Form-item label="流量池编号"  >
                      <Input v-model="searchForm.pool_Num" ></Input>
                    </Form-item>
                  </Row>
                </Form>
                <Row >
                  <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
                  <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
                </Row>
            </div>
         </Poptip>
        </Col>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData" ></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <reCharge    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></reCharge>
  </div>
  


</template>

<script>
  import {poolListPage} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import reCharge from './reCharge.vue'
  import expandRow from './poolExpendRow.vue';
  export default {
    name:'poolList',//当前文件名
    components:{
      reCharge,
      expandRow
    },
    data() {
      return {
        searchPaneShow:false,
        tableLoading:false,
        tableColums: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            align:'center',
            title: '客户名称',
            key: 'Cus_Name',
          },
          {
            align:'center',
            title: '流量池编号',
            key: 'PoolNum',
          },
          {
            align:'center',
            title: 'SIM数量',
            key: 'SimCount',
          },
          {
            align:'center',
            title: '流量池状态',
            key: 'PoolStatus'
          },
          {
            align:'center',
            title: '流量池容量(GB)',
            key: 'PoolFlowSize',render: (h, params) => { return params.row.PoolFlowSize/(1024*1024);},
          },
          {
            align:'center',
            title: '生效时间',
            key: 'ValidDate',
          },
//          {
//            align:'center',
//            title: '过期时间',
//            key: 'ExpValidDate',
//          },
          {
            align:'center',
            title: '备注',
            key: 'Remark',
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              let actions=[];
              if (params.row.Cus_CustomerId){
                actions.push( h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showReChargeForm(params.row)
                    }
                  }
                }, '加油包'));
                actions.push( h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.enlarge()
                    }
                  }
                }, '扩容'));
              }
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'流量池续费',
        parentForm:{

        },
        searchForm:{
          cus_Name: '',
          pool_Num:'',
          rows:10,
          page:1,
        },
      }
    },
    created(){
 
    },
    mounted(){
      this.getTableList();
    },
    methods: {
      searchEnter(){
         this.searchPaneShow=!this.searchPaneShow;
      },
      resetSearch(){
         this.searchForm.cus_Name='';
         this.searchForm.pool_Num='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await poolListPage(params);
        this.total = res.total;
        this.tableData = res.rows;
        this.tableLoading=false;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      showReChargeForm(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formShow=true;
      },
      // 扩容
      enlarge(){
        this.$Notice.open({
          title: '提示',
          desc: '扩容请联系客服，电话 400-878-0756',
          duration: 0
        });
      },
      hideModel(){
        this.formShow=false;
      },
    }
  }

</script>
