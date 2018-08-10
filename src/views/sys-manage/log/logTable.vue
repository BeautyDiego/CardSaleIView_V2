<style>
  
  .logManagement {
    padding:10px;
    min-height:600px;
  }

</style>

<template>
  
  <div class="logManagement">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
          <Poptip  width="400" title='搜索' placement="bottom-end" class="top-btn">
            <Button type="primary" size="large" icon="ios-search">搜  索</Button>
            <div style="text-align:center" slot="content">
              <Form ref="searchForm" :model="searchForm" :label-width="80"  value=true  style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                <Row>
                  <Form-item label="登录名"  >
                    <Input v-model="searchForm.LoginName" ></Input>
                  </Form-item>
                </Row>
                <Row>
                  <Form-item label="具体操作"  >
                    <Input v-model="searchForm.Detail" ></Input>
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
  </div>

</template>

<script>
  import Cookies from 'js-cookie'
  import {logPagedList} from './../../../api/getData'
  export default {
    name:'log',
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
            title: '登录名',
            key: 'LoginName',
          },
          {
              align:'center',
              title: 'IP',
              key: 'IP',
          },
          {
            align:'center',
            title: '页面',
            key: 'Page',
          },
          {
            align:'center',
            title: '具体操作',
            key: 'Detail',
          },
          {
              align:'center',
              title: '操作时间',
              key: 'LogDate',
          }
        ],
        tableData: [
        ],
        total:0,
        currentPage:1,
        btnLoading:false,
        searchForm:{
          LoginName: '',
          Detail: '',
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
      resetSearch(){
         this.searchForm.LoginName='';
          this.searchForm.Detail='';
      },
      doSearchTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await logPagedList(params);
        this.total = res.total;
        this.tableData = res.rows;
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      }
    }
  }

</script>
