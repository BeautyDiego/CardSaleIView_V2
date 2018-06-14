<style scoped>

</style>

<template>
  
  <div>
    
    <Modal
            v-model="IsModalShow"
            title="SIM卡组员信息"
            :mask-closable="false"
            @on-cancel="cancel"
            width="600">

        <Row>
          <Table stripe size="small"
                 height="478"
                 :columns="tableColums"
                 :data="GroupTableData"
                 ></Table>
        </Row>
      <div slot="footer">
        <Button type="ghost"  @click="cancel" >取消</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {simGroupSimCardList} from './../../../api/getData'
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
        tableLoading:false,
        tableColums: [
          {
            align:'center',
            title: 'SIM卡号',
            key: 'SimNum',
          },
          {
            align:'center',
            title: '卡状态',
            key: 'SimStatus',
          },
        ],
        GroupTableData:[],

      }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if (curVal){
          this.getSimGroupSimCardTableList();
        }
      }
    },
    created(){
    
    },
    mounted(){
      
    },
    methods: {
      async getSimGroupSimCardTableList(){
        const params = {SimGroupId:this.modalForm.Id};
        this.GroupTableData = await simGroupSimCardList(params);
      },
      cancel() {
        this.$emit('listenModalForm');
      },
    }
  }

</script>
