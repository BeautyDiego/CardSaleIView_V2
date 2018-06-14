

<template>

  <div class="expanse-config">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
          <Button class="top-right-btn" size="large" icon="plus" @click="addAction">添加</Button>
          <!--<Button @click="searchEnter"   class="top-btn" size="large" icon="search" >搜索</Button>-->
        <transition name="fade">
          <Card v-show="searchPaneShow" style="position:absolute;top:1px;right:185px;z-index:100;" :padding=12>
            <p style="text-align:center;margin-bottom:10px;"><Icon type="search"></Icon>搜索</p>
            <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:400px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="用户名称"  >
                  <Input v-model="searchForm.uName" ></Input>
                </Form-item>
              </Row>
            </Form>
            <Row >
              <Button  style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small"   @click="doSearchTableList">确定</Button>
              <Button  style="float:right;margin-top:10px;" size="small" @click="resetSearch" >重置</Button>
            </Row>
          </Card>
        </transition>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--新增编辑-->
    <simExpanseConfigForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></simExpanseConfigForm>
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
        <Button type="error" size="large" long :loading="btnLoading"  @click="comfirmDel">删除</Button>
      </div>
    </Modal>
  </div>

</template>

<style>
  .expanse-config {
    padding:10px;
    min-height:600px;
  }
</style>

<script>
  import {simExpanseConfigPagedList,delSimExpanseConfig} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';
  import simExpanseConfigForm from './simExpanseConfigForm.vue'
  export default {
    name:'userManagement',
    components:{
      simExpanseConfigForm,
    },
    data() {
      return {
        searchPaneShow:false,
        tableColums: [
          {
            align:'center',
            title: '阶段',
            key: 'Stage',
          },
          {
            align:'center',
            title: '最小SIM卡数量',
            key: 'MinSimCount',
          },
          {
            align:'center',
            title: '最大SIM卡数量',
            key: 'MaxSimCount',
          },
          {
            align:'center',
            title: '最小流量(GB)',
            key: 'MinFlowCount'
          },
          {
            align:'center',
            title: '最大流量(GB)',
            key: 'MaxFlowCount'
          },
          {
            align:'center',
            title: '购买单价(￥/GB)',
            key: 'SinglePrice',render: (h, params) => { return params.row.SinglePrice.toFixed(2);}
          },
          {
            align:'center',
            title: '续费单价(￥/GB)',
            key: 'ChargePrice',render: (h, params) => { return params.row.ChargePrice.toFixed(2);}
          },
          {
            align:'center',
            title: '原单价(￥/GB)',
            key: 'OriginalPrice',render: (h, params) => { return params.row.OriginalPrice.toFixed(2);}
          },
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
                      this.editAction(params.row)
                    }
                  }
                }, '修改'));
              
                actions.push(  h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.delAction(params.row.Id)
                    }
                  }
                }, '删除'));
              
              return h('div', actions);
            }
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        formTitle:'添加资费配置',
        resetForm:{
          Id:'',
          Stage: '',
          MinSimCount:0,
          MaxSimCount:0,
          MinFlowCount:0,
          MaxFlowCount:0,
          SinglePrice:0,
          ChargePrice:0,
          OriginalPrice:0,
          Remark:'',
        },
        parentForm:{
          Id:'',
          Stage: '',
          MinSimCount:0,
          MaxSimCount:0,
          MinFlowCount:0,
          MaxFlowCount:0,
          SinglePrice:0,
          ChargePrice:0,
          OriginalPrice:0,
          Remark:'',
        },
        delModal:false,
        delId:'', //删除的Id
        btnLoading:false,
        searchForm:{
          uName: '',
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
         this.searchForm.uName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await simExpanseConfigPagedList(params);
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      addAction() {
        this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
        this.formTitle='添加资费配置';
        this.formShow=true;
      },
      editAction(row){
        this.parentForm=JSON.parse(JSON.stringify(row));
        this.formTitle='修改资费配置';
        this.formShow=true;
      },
      delAction(Id){
        this.delId=Id;
        this.delModal=true;
      },
      async comfirmDel(){
        this.btnLoading=true;
        try{
          const res= await delSimExpanseConfig({Id:this.delId});
          if (res.success) {
            this.$Message.success('删除成功!');
            this.getTableList();
            this.delModal=false;
          }else{
            this.$Message.error(res.msg);
          }
        }catch(err){
          console.log(err);
          this.$Message.error('服务器异常，稍后再试');
        }
        this.btnLoading=false;
      },
      hideModel(){
        this.formShow=false;
      },
    }
  }

</script>
