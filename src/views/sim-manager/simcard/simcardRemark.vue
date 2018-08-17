<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow":title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="600">
    <div>
      <Row style="height:30px;font-size:14px;font-weight: bold">
        <div>SIM卡号：{{modalForm.SimNum}}</div>
      </Row>
      <Row style="height:30px;font-size:14px;font-weight: bold">
        <div>流量池编号：{{modalForm.PoolNum}}</div>
      </Row>
      <Row>
        <Input v-model="modalForm.Remark" type="textarea" :rows="4" placeholder="请输入备注"></Input>
      </Row>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="editSimCardRemark">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {editSimcard} from './../../../api/getData'
export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            SimNum: '',
            PoolNum:'',
            Remark:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '查看详情',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
        }
    },

    watch:{
      modalShow(curVal,oldVal){
        this.modalForm = Object.assign(this.parentForm);
        this.IsModalShow = curVal;
      }
    },
    created(){

    },
    mounted(){
    
    },
    methods: {
      async editSimCardRemark(){
        this.modalForm_loading=true;
        try{
          let result= await editSimcard(this.modalForm);
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
      },
      cancel() {
          this.$emit('listenModalForm');
      },
    }
}

</script>
