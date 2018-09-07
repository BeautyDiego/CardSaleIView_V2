<style scoped>

</style>

<template>
  
  <div>
    
    <Modal
            v-model="IsModalShow"
            title="SIM卡分组"
            :mask-closable="false"
            @on-cancel="cancel"
            width="1000">
      <Row >
        <Col span="11" style="height:500px;">
          <Row style="margin-bottom:5px;">
            <Input v-model="searchForm.ICCID" placeholder="请输入ICCID" clearable  @on-change="searchSIMTableList"></Input>
          </Row>
         <Row style="margin-bottom:5px;">
           <RadioGroup v-model="searchForm.OperType" type="button" size="large"  @on-change='doChangeOperType' >
              <Radio label="中国电信"></Radio>
              <Radio label="中国移动"></Radio>
              <Radio label="中国联通"></Radio>
            </RadioGroup>
          </Row>


          <Row>
            <Table  stripe
                    size="small"
                    height="440"
                    :loading="tableLoading"
                    :columns="simTableColums"
                    :data="SIMTableData"
                    @on-selection-change="onSIMTableSelectChange"
                    @on-sort-change="onSIMTableSortChange"></Table>
          </Row>
          <Row>
            <Page :total="total" size="small" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
          </Row>
        </Col>
        <Col span="2"  style="height:500px;">
            <div style="margin-left:17px;margin-top:180px;">
              <Button icon="chevron-right" :loading="modalForm_loading" @click="JoinGroup"></Button>
              <Button icon="chevron-left" :loading="modalForm_loading" @click="DepartGroup" style="margin-top:5px;"></Button>
            </div>
        </Col>
        <Col span="11"  style="height:500px;">
        <Row>
          <Table stripe size="small"
                 height="478"
                 :columns="groupTableColums"
                 :data="GroupTableData"
                 @on-selection-change="onGroupTableSelectChange"></Table>
        </Row>
         <Row style="text-align:center">
          共{{GroupTableData.length}}条
         </Row>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="ghost"  @click="cancel" >关闭</Button>
        <Button type="primary"  :loading="modalForm_loading" @click="saveForm">保存</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {simcardTransferListPage,simGroupSimCardList,addSimToGroup} from './../../../api/getData'
  import formatter from './../../../libs/formatter'
  export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            GroupName: '',
            GroupDescribe: '',
            Remark:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        IsModalShow:false,
        modalForm:{
        },
        modalForm_loading:false,
        searchForm:{
          SimGroupId:'',
          SimStatus:'全部',
          ICCID: '',
          rows:10,
          page:1,
          OperType:'中国移动',
          orderby:'asc'
        },
        total:0,
        currentPage:1,
        tableLoading:false,
        simTableColums: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            align:'center',
            title: 'ICCID',
            width:130,
            key: 'ICCUID',
            sortable: 'custom',
          },
          {
            align: 'center',
            title: '运营商',
            width: 140,
            key: 'OperName',
            render: (h, params) => {
                const row = params.row;
                const color = formatter.operNameColor(row.OperName);
                const text = row.OperName;
                return h('Tag', {
                    props: {
                        type: 'dot',
                        color: color
                    }
                }, text);
            },
          },
          {
            align:'center',
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
        ],
        groupTableColums: [
              {
                  type: 'selection',
                  width: 60,
                  align: 'center'
              },
              {
                  align:'center',
                  title: 'ICCID',
                  width:130,
                  key: 'ICCUID',
                  sortable: true,
              },
              {
                  align: 'center',
                  title: '运营商',
                  width: 140,
                  key: 'OperName',
                  render: (h, params) => {
                      const row = params.row;
                      const color = formatter.operNameColor(row.OperName);
                      const text = row.OperName;
                      return h('Tag', {
                          props: {
                              type: 'dot',
                              color: color
                          }
                      }, text);
                  },
              },
              {
                  align:'center',
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
          ],
        SIMTableData: [
        ],
        GroupTableData:[],
        simCardSelection:[],
        groupSelection:[],
      }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if (curVal){
          this.searchForm.SimGroupId= this.modalForm.Id;
          this.searchForm.ICCID='';
          this.getTableList();
          this.getSimGroupSimCardTableList();
        }
      }
    },
    created(){
    
    },
    mounted(){
      
    },
    methods: {
      searchSIMTableList(){
        this.currentPage=1;
        this.getTableList();
      },
      async getTableList(){
        this.tableLoading=true;
        this.searchForm.page = this.currentPage;
        const params = this.searchForm;
        const res = await simcardTransferListPage(params);
        this.total = res.total;
        console.log(res.total)
        this.SIMTableData = res.rows;
        this.tableLoading = false;
      },
      async getSimGroupSimCardTableList(){
        
        const params = {SimGroupId:this.modalForm.Id};
        this.GroupTableData = await simGroupSimCardList(params);
      },
      changeCurrentPage(num){
        this.currentPage=num;
        this.getTableList();
      },
      onSIMTableSelectChange(selection){
        this.simCardSelection=selection;
      
      },
      onSIMTableSortChange(sort){
          this.searchForm.orderby=sort.order;
          this.getTableList();
      },
      onGroupTableSelectChange(selection){
        this.groupSelection=selection;
      },
      
      //加入组
      async JoinGroup(){
        this.modalForm_loading=true;
        if (this.simCardSelection.length>0){
          let joinArr=this.GroupTableData;
          let newArr=[];
          const len=joinArr.length;
          if ( this.GroupTableData.length>0){
            this.simCardSelection.forEach(function(item, index, array) {
              let flag=true;
              console.log(item)
              for (let i=0;i<len;i++){
                if(item.SimNum ===joinArr[i].SimNum){
                  flag=false;
                  break;
                }
              }
              if (flag){
                newArr.push(item);
              }
            });
            this.GroupTableData=this.GroupTableData.concat(newArr);
          }else{
            this.GroupTableData=this.simCardSelection;
          }
        }
        this.modalForm_loading=false;
      },
      //离开组
      DepartGroup(){
        this.modalForm_loading=true;
        if (this.groupSelection.length>0){
          let departArr=this.groupSelection;
          let newArr=[];
          const len=departArr.length;
          this.GroupTableData.forEach(function(item, index, array) {
            let flag=true;
            for (let i=0;i<len;i++){
              if(item.SimNum ===departArr[i].SimNum){
                flag=false;
                break;
              }
            }
            if (flag){
              newArr.push(item);
            }
          });
          this.GroupTableData=newArr;
        }
        this.modalForm_loading=false;
      },
      cancel() {
        this.$emit('listenModalForm');
      },
       doChangeOperType(){
         this.searchSIMTableList();
      },
      async saveForm() {
            this.modalForm_loading=true;
            let paramsArr=this.GroupTableData.map((v, i, a) => {
                return v.Id
            });
            console.log(paramsArr)
            try{
              let result=await addSimToGroup({SimGroupId:this.modalForm.Id,SimCardIdList:paramsArr})
              if (result.success) {
                this.$Message.success('提交成功!');
                this.$emit('listenModalForm');
              }else{
                this.$Message.error(result.msg);
              }
            }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.modalForm_loading=false;
      },
    }
  }

</script>
