<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 3px 60px">
      <Form-item label="客户名称" prop="Cus_Name" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.Cus_Name" disabled='true'></Input>
      </Form-item>
    <Form-item label="资费名称：" prop='expId' :rules="{required: true, message: '必填', trigger:'blur',type:'number'}" >
          <Select v-model="modalForm.expId"  >
            <Option v-for="item in expList" :value="item.Id" :key="item.Id" :label="item.ExpName">
              <span>{{ item.ExpName }}</span>
               <span style="float:right;color:#ccc">{{item.OperType}}&nbsp&nbsp{{item.FlowSize}}&nbsp&nbsp￥{{item.OfficialPirce.toFixed(2)}}元</span>
            </Option>
          </Select>
        </Form-item>

        <Form-item label="折扣率" prop="Discount" :rules="{required: true, message: '必填,最小0.01，最大1',min:0.01,max:1,  trigger:'blur',type:'number'}" >
        <InputNumber v-model="modalForm.Discount" :min='0' :max='1000000'>
        </InputNumber>
      </Form-item>
     <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </Form>

    <Row>
      <Table stripe size="small"  :columns="tableColums" :data="tableData"></Table>
    </Row>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
 
    </div>
  </Modal>
</div>

</template>

<script>
import {getDiscount,getExpensesList,addCusDiscount} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            Cus_Name: '',
            LoginName: '',
            Cus_Address: '',
            Industry: '',
            Region: '',
            ManagerName: '',
            ManagerEmail: '',
            ManagerMobile:'',
            Remark:'',
            Discount:''
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '折扣率',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
           tableColums: [
            {align:'center',title: '资费名称',key: 'ExpName'},
            {align:'center',title: '运营商',key: 'OperType'},
            {align:'center', title: '标准价格', key: 'OfficialPirce' },
            {align:'center', title: '折扣率', key: 'Discount' }
            ],
          tableData: [
        ],
        total:0,
        searchForm:{
          cus_id: 0,
          rows:10,
          page:1,
        },
        expList:[],
        disParams:{
          Id:0,
          Cus_CustomerId:0,
          Res_ExpensesId:0,
          Discount:1,
        },
      }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if(curVal)
          this.getDiscountList();
          this.getExpList();
      }
    },
    created(){

    },
    mounted(){
     
    },
    methods: {
      async addDiscount(){
         let res=  await addCusDiscount(this.modalForm);
      },
      async getExpList(){
        let res= await getExpensesList();
        this.expList=res;
      },
      cancel() {
          this.$emit('listenModalForm');
      },
      async getDiscountList(){
         this.searchForm.cus_id=this.modalForm.Id;
          let res =await getDiscount(this.searchForm);
          this.total = res.total;
        this.tableData = res.rows;
      },
      async saveForm(name) {
      this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.disParams.Cus_CustomerId=this.modalForm.Id;
            this.disParams.Res_ExpensesId=this.modalForm.expId;
            this.disParams.Discount=this.modalForm.Discount;
            console.log(this.disParams);
            let res=  await addCusDiscount(this.disParams);
            console.log(res)
            if (res.success) {
                this.$Message.success('提交成功!');
                this.getDiscountList();
              }else{
                this.$Message.error(res.msg);
              }
          }});
        
      },
    }
}

</script>
