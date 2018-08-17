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
    <Form ref="modalForm" :model="modalForm" :label-width="80"  value=true  style="padding: 3px 60px">
      <Form-item label="功能名称" prop="FunName" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}">
        <Input v-model="modalForm.FunName" ></Input>
      </Form-item>
      <Form-item label="功能代码" prop="FunCode" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.FunCode" ></Input>
      </Form-item>
      <Form-item label="页面地址" >
        <Input v-model="modalForm.PageUrl" ></Input>
      </Form-item>
      <Form-item label="排序编号" prop="AscOrderby" :rules="{required: true, message: '必填', trigger:'blur',type: 'number'}">
        <InputNumber v-model="modalForm.AscOrderby" style="width:100%;" ></InputNumber>
      </Form-item>
      <Form-item label="父级功能" prop="ParentFunId" :rules="{required: true, message: '必填', trigger:'change',type:'number'}">
        <Select v-model="modalForm.ParentFunId" placeholder="请选择">
          <Option v-for="item in funList" :value="item.Id" :key="item.Id">{{ item.FunName }}</Option>
        </Select>
      </Form-item>
      <Form-item label="图标选择">
        <Button type="ghost"  :icon="modalForm.IconCss" @click="showIconModal">{{modalForm.IconCss==''?'请选择':''}}</Button>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
  <functionIcon :modalShow="iconModalShow" @listenModalIcon="hideIconModel" @listenChildIcon="sendIcon"></functionIcon>
</div>

</template>

<script>
import {parentFunctionList,addFunction,editFunction} from './../../../api/getData'
import functionIcon from './functionIcon.vue'
export default {
    components:{
      functionIcon
    },
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            FunName: '',
            IconCss: 'android-hand',
            FunCode:'',
            PageUrl:'',
            AscOrderby:1,
            ParentFunId:0,
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
      modalFormTitle:{
        type: String,
        default: '添加功能',
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
            Id:'',
            FunName: '',
            IconCss: '',
            FunCode:'',
            PageUrl:'',
            AscOrderby:1,
            ParentFunId:0,
          },
          modalForm_loading:false,
          funList:[],
          iconModalShow:false,
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        this.getParentFunctionList();
      }
    },
    mounted(){
       this.getParentFunctionList();
    },
    methods: {
      async getParentFunctionList () {
        let result = await parentFunctionList();
        result.unshift({ Id :0, FunName : "一级目录" });
        this.funList=result;
      },
      cancel() {
          this.$emit('listenModalForm');
      },
      saveForm(name) {
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            const params = this.modalForm;
            try{
              let result;
              if (this.modalFormTitle ==='添加功能'){
                 result = await addFunction(params);
              }else{
                 result = await editFunction(params);
              }
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
      showIconModal(){
        this.iconModalShow=true;
      },
      hideIconModel(){
        this.iconModalShow=false;
        this.modalForm.IconCss=icon;
      },
      sendIcon(icon){
        this.iconModalShow=false;
        this.modalForm.IconCss=icon;
      }
    }
}

</script>
