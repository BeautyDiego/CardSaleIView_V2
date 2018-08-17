<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="设置按钮"
    @on-cancel="cancel"
    width="1000">
    <Row>
      <Col :span="formTitle===''?24:15">
        <Row>
          <Button size="small" icon="plus" @click="addAction">添加</Button>
          <Button size="small" icon="edit" @click="editAction">修改</Button>
        </Row>
        <Row>
          <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
        </Row>
      </Col>
      <Col span="9" v-if="formTitle">
        <h3 style="margin:10px 50px;">{{formTitle}}</h3>
        <Form ref="modalForm" :model="modalForm" :label-width="80"  value=true  style="padding: 3px 60px">
          <Form-item label="按钮名称" prop="ActionName" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}">
            <Input size="small" v-model="modalForm.ActionName" ></Input>
          </Form-item>
          <Form-item label="按钮代码" prop="ActionCode" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
            <Input size="small" v-model="modalForm.ActionCode" ></Input>
          </Form-item>
          <Form-item label="请求地址" >
            <Input size="small" v-model="modalForm.ajaxUrl" ></Input>
          </Form-item>
        </Form>
      </Col>
    </Row>
   
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
//import {actionList,addAction,editAction} from './../../api/getData'
//import {clearObj} from './../../util/objUtil';
export default {
    props:{
      modalShow:{
        type: Boolean,
        default: false,
      },
      Rbac_FunctionId:{
        type: Number,
        default: 0,
      }
    },
    data() {
        return {
          IsModalShow:false,
          tableColums: [
            {
              align:'center',
              title: '按钮名称',
              key: 'ActionName',
            },
            {
              align:'center',
              title: '按钮代码',
              key: 'ActionCode',
            },
            {
              align:'center',
              title: '请求地址',
              key: 'ajaxUrl',
            },
                {
                  title: '操作',
                  align: 'center',
                  render: (h, params) => {
                    return h('div', [
                      h('Button', {
                        props: {
                          type: 'warning',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.editAction(params.index)
                          }
                        }
                      }, '修改'),
                      h('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        },
                        on: {
                          click: () => {
                            this.delAction(params.index)
                          }
                        }
                      }, '删除')
                    ]);
                  }
                }
          ],
          tableData: [
            {
              ActionName: '客户属性',
              ActionCode:'',
              Rbac_FunctionId: 1,
              ajaxUrl:'qweqw'
            }
          ],
          formTitle:'',
          modalForm:{
            Id:'',
            ActionName: '',
            ActionCode: '',
            Rbac_FunctionId:'',
            ajaxUrl:'',
          },
          modalForm_loading:false,
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        this.getActionnList();
      }
    },
    mounted(){
      if (parseInt(this.Rbac_FunctionId)>0){
        this.getActionnList();
      }
    },
    methods: {
      async getActionnList(){
        this.tableData= await actionList({Rbac_FunctionId:this.Rbac_FunctionId});
      },
      cancel() {
          this.formTitle='';
          this.$emit('listenActionTable');
      },
      addAction(){
         this.formTitle='添加按钮';
         clearObj(this.modalForm);
         this.modalForm.Rbac_FunctionId=this.Rbac_FunctionId;
      },
      editAction(index){
         this.formTitle='修改按钮';
         this.modalForm=JSON.parse(JSON.stringify(this.tableData[index]));
      },
      delAction(){
    
      },
      saveForm(name){
        this.$refs[name].validate( async (valid) => {
          if (valid) {
            this.modalForm_loading=true;
            debugger;
            const params = this.modalForm;
            try{
              let result;
              if (this.formTitle ==='添加按钮'){
                result = await addAction(params);
              }else{
                result = await editAction(params);
              }
              if (result.success) {
                this.$Message.success('提交成功!');
                this.getActionnList();
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
      }
    }
}

</script>
