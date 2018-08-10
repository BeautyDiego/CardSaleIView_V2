<style scoped>

.functionManagement {
  padding:10px;
}

</style>

<template>

<div class="functionManagement">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;">
        <Row>
            <Button class="top-right-btn"  size="large" icon="trash-a" @click="delFun">删除</Button>
            <Button class="top-btn"   size="large" icon="edit" @click="editFun">修改</Button>
            <Button class="top-btn"   size="large" icon="plus" @click="addFun">添加</Button>
        </Row>
    </div>
    <Row>
      <!--<Table stripe size="small" :columns="tableColums" :data="tableData"></Table>-->
      <tree-grid
        :items='tableData'
        :columns='tableColums'
        @on-row-click='rowClick'
        @on-selection-change='selectionClick'
        @on-sort-change='sortClick'
      ></tree-grid>
    </Row>
    <function-form :modalShow="formShow"
                   :modalFormTitle="formTitle"
                   :parentForm="parentForm"
                   @listenModalForm="hideModel"
                   @refreshTableList="getTableList" ></function-form>
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
import treeGrid from '../component/treeGrid.vue';
import functionForm from './functionForm.vue';
import {functionTreeGrid,delFunction} from './../../../api/getData'
import {clearObj} from './../../../libs/util';
export default {
    components:{
      functionForm,
      treeGrid,
    },
    data() {
            return {
              rbac_ActionList:[],
              tableColums: [
                
                {
                  align:'left',
                  title: '功能名称',
                  key: 'FunName',
                  width: '150',
                },
                {
                  align:'center',
                  title: '排序编号',
                  key: 'AscOrderby',
                  width: '150',
                },
                {
                  align:'center',
                  title: '功能代码',
                  key: 'FunCode',
                },
                {
                  align:'center',
                  title: '页面地址',
                  key: 'PageUrl',
                  width: '150',
                },
//                {
//                  align:'center',
//                  title: '操作',
//                  type: 'action',
//                  actions: [{
//                    type: 'primary',
//                    text: '设置按钮'
//                  }],
//                  width: '150',
//                }
              ],
              tableData: [
                {
                  FunName: '客户属性',
                  IconCss: 1,
                  FunCode:'eqwe',
                  PageUrl:'qweqw'
                }
              ],
              formShow:false,
              formTitle:'添加功能',
              selectForm:'',
              parentForm:{
                Id:'',
                FunName: '',
                IconCss: '',
                FunCode:'',
                PageUrl:'',
                AscOrderby:1,
                ParentFunId:0,
              },
              delModal:false,
              btnLoading:false,
            }
        },
        created(){

        },
        mounted(){
          this.getTableList();
        },
        methods: {
          async getTableList(){
            this.tableData=await functionTreeGrid();
          },
          addFun() {
            clearObj(this.parentForm);
            this.parentForm.AscOrderby=1;
            this.formTitle='添加功能';
            this.formShow=true;
          },
          editFun(){
            if (this.selectForm===''){
              this.$Message.warning('请选择一行后编辑');
            }else{
              this.parentForm=Object.assign(this.selectForm);
              this.formTitle='修改功能';
              this.formShow=true;
            }
          },
          delFun(){
            if (this.selectForm===''){
              this.$Message.warning('请选择一行后删除');
            }else{
            this.delModal=true;
            }
          },
          async comfirmDel(){
            this.btnLoading=true;
            try{
              const res= await delFunction({Id:this.selectForm.Id});
              if (res.success) {
                this.$Message.success('删除成功!');
                this.getTableList();
                this.delModal=false;
              }else{
                this.$Message.error(res.msg);
              }
            }catch(err){
              console.log(err);
              this.$Message.error('服务器异常，稍后再试');
            }
            this.btnLoading=false;
          },
          hideModel(){
            this.formShow=false;
          },
          rowClick(data, event,index ) {
            if(this.selectForm!==''&&this.selectForm.Id===data.Id){
              this.selectForm=''
            }else{
              this.selectForm=JSON.parse(JSON.stringify(data));
            }
          },
          selectionClick(arr) {
          //  console.log('选中数据id数组:' + arr)
          },
          sortClick(key, type) {
         //   console.log('排序字段:' + key)
          //  console.log('排序规则:' + type)
          }
        }
}

</script>
