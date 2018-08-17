<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="客户发卡"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <Form ref="customerForm" :model="customerForm"  :label-width="100"  value=true  style="padding: 35px 80px 15px 60px">
        <Form-item label="客户：" prop="customerId" :rules="{required: true, message: '必填', trigger:'change',type:'number'}" >
          <Select v-model="customerForm.customerId"  >
            <Option v-for="item in customerList" :value="item.Id" :key="item.Id" :label="item.Cus_Name">
            </Option>
          </Select>
        </Form-item>
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('customerForm')">确认发卡</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {customerCombo,groupToCustomer} from './../../../api/getData'
export default {
    components:{

    },
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            GroupName: '',
            GroupDescribe: '',
            OwerType:'',
            Remark:'',
            PoolNum:'',
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
          customerForm:{
              customerId:''
          },
          modalForm_loading:false,
          customerList:[],
        }
    },
    computed: {

    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if (curVal){
          this.modalForm=Object.assign(this.parentForm);
          this.getCustomerList();
        }
      },
    },
    created(){
 
    },
    mounted(){

    
    },
    methods: {
      async getCustomerList(){
        this.customerList= await customerCombo();
      },

      cancel() {
          this.$emit('listenModalForm');
      },
      /*
      * @@审核订单
      * */
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = {SimGroupId:this.modalForm.Id,CustomerId:this.customerForm.customerId};
            try{
              let result=await groupToCustomer(params);
              if (result.success) {
                this.$Message.success('提交成功!');
                this.$emit('listenModalForm');
                this.$emit('refreshTableList');
              }else{
                this.$Message.error(result.msg);
              }
            }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.modalForm_loading=false;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
    }
}

</script>
