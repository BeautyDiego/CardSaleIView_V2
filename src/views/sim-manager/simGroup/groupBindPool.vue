<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="绑定流量池"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 35px 80px 15px 60px">
      
        <Form-item label="流量池：" prop="PoolNum" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
          <Select v-model="modalForm.PoolNum"  >
            <Option v-for="item in poolList" :value="item.PoolNum" :key="item.Id" :label="item.PoolNum">
              <div>{{ item.PoolNum }}</div>
              <div style="color:#ccc;padding-top:10px;">{{item.PoolFlowSize/1024/1024+'GB'}}&nbsp&nbsp{{item.EffDate}}~{{item.ExpDate}}</div>
            </Option>
          </Select>
        </Form-item>
      
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">确认绑定</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getUnGroupPoolList,groupBindPool} from './../../../api/getData'
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
          modalForm_loading:false,
          poolList:[],
        }
    },
    computed: {

    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if (curVal){
          this.modalForm=Object.assign(this.parentForm);
          this.getPoolList();
        }
      },
    },
    created(){
 
    },
    mounted(){

    
    },
    methods: {
      async getPoolList(){
        this.poolList= await getUnGroupPoolList();
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
            let PoolNum = this.modalForm.PoolNum;
            let PoolId= this.poolList.find(p => p.PoolNum===PoolNum ).Id
            const params = {SimGroupId:this.modalForm.Id,PoolNum:PoolNum,PoolId:PoolId};
            try{
              let result=await groupBindPool(params);
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
