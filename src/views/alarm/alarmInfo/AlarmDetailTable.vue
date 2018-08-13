<style>
  
  .userManagement {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="userManagement">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
              <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                <Row>
                  <Form-item label="任务名称" >
                    <Input v-model="searchForm.taskName" ></Input>
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
      <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>


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

<script>
 // import Cookies from 'js-cookie'
  import {getAlarmList,} from './../../../api/getData'
  import {clearObj} from './../../../libs/util';

  export default {
    name:'userManagement',
    components:{
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
            align:'center',
            title: '任务名称',
            key: 'TaskName',
          },
          {
            align:'center',
            title: '所属企业',
            key: 'Company',
          },
          {
            align:'center',
            title: '触发卡号',
            key: 'SimNum',
          },
          {
            align:'left',
            title: '规则',
            key: 'TaskType',
          },
          {
            align:'center',
            title: '内容',
            key: 'AlarmContent',
            width: 460,
          },
          {
              align:'center',
              title: '报警时间',
              key: 'AlarmTime',
          },
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        formShow:false,
        delModal:false,
        delId:'', //删除的Id
        resetModal:false,
        btnLoading:false,
        searchForm:{
          taskName: '',
          rows:10,
          page:1,
        },
      }
    },
    computed: {
      // UserId: function () {
      //   return  Cookies.get('userId');
      // },
    },
    created(){

    },
    mounted(){
      this.getTableList();
    },
    methods: {
      resetSearch(){
         this.searchForm.taskName='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await getAlarmList(params);
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },

      hideModel(){
        this.formShow=false;
      },
    }
  }

</script>
