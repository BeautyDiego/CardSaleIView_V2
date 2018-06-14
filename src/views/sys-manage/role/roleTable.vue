<style scoped>

.roleManagement {
  padding:10px;
}

</style>

<template>

<div class="roleManagement">

    <!--<Row>-->
      <!--<Button  size="large" icon="plus" @click="addRole">添加</Button>-->
    <!--</Row>-->
   <!--table-->
    <Row>
      <Col :xs="24" :sm="24" :md="18" :lg="12">
        <Row>
          <Table stripe size="small" :columns="tableColums" :data="tableData"></Table>
        </Row>
        <Row>
          <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
        </Row>
      </Col>
     
    </Row>
     <!--新增编辑-->
    <roleForm    :modalShow="formShow"
                 :modalFormTitle="formTitle"
                 :parentForm="parentForm"
                 @listenModalForm="hideModel"
                 @refreshTableList="getTableList" ></roleForm>
    <!--新增编辑-->
    <roleTree    :treeShow="treeShow"
                 :roleId="setTreeRoleId"
                 @listenModalTree="hideTree"></roleTree>
    <!--是否删除框-->
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
import {rolePagedList,delRole} from './../../../api/getData'
import {clearObj} from './../../../libs/util';
import roleForm from './roleForm.vue'
import roleTree from './roleTree.vue'
export default {
    name:'roleManagement',
    components:{
      roleForm,
      roleTree,
    },
    data() {
            return {
              tableColums: [
                {
                  align:'center',
                  title: '角色名称',
                  key: 'RoleName',
                },
                {
                  align:'center',
                  title: '人员类型',
                  key: 'RoleNum',
                  render: (h, params) => {
                    let roleType=params.row.RoleNum==1?'管理员':'普通用户';
                    return h('span',roleType);
                  }
                },
                {
                  title: '操作',
                  align: 'center',
                  render: (h, params) => {
                    let actions=[];
                 
                      actions.push(h('Button', {
                        props: {
                          type: 'primary',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.setRoleTree(params.row.Id)
                          }
                        }
                      }, '设置权限'));
                  
                      actions.push(h('Button', {
                        props: {
                          type: 'warning',
                          size: 'small'
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            this.editRole(params.row)
                          }
                        }
                      }, '修改'));
                   
//                      actions.push(h('Button', {
//                        props: {
//                          type: 'error',
//                          size: 'small'
//                        },
//                        on: {
//                          click: () => {
//                            this.delRole(params.row.Id)
//                          }
//                        }
//                      }, '删除'));
                    
                    return h('div', actions);
                  }
                }
              ],
              tableData: [
                {
                  RoleName: '客户属性',
                  RoleNo: '',
                }
              ],
              total:0,
              currentPage:1,
              formShow:false,
              formTitle:'添加角色',
              parentForm:{
                Id:'',
                RoleName: '',
                RoleNum: '',
              },
              delModal:false,
              delId:'', //删除的Id
              btnLoading:false,
              treeShow:false,
              setTreeRoleId:0,//配置角色权限的roleId
            }
        },
        created(){

        },
        mounted(){
          this.getTableList();
        },
        methods: {
          async getTableList (){
            const params = {page:this.currentPage,rows:10};
            const res = await rolePagedList(params);
            this.total = res.total;
            this.tableData = res.rows;
          },
          changeCurrentPage(num){
            this.currentPage=num;
            this.getTableList();
          },
          addRole() {
            clearObj(this.parentForm);
            this.formTitle='添加角色';
            this.formShow=true;
          },
          editRole(row){
              this.parentForm=Object.assign(row);
              this.formTitle='修改角色';
              this.formShow=true;
          },
          delRole(Id){
              this.delId=Id;
              this.delModal=true;
          },
          async comfirmDel(){
            this.btnLoading=true;
            try{
              const res= await delRole({Id:this.delId});
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
          setRoleTree(Id){
            this.setTreeRoleId = parseInt(Id);
            this.treeShow = true;
          },
          hideTree(){
            this.treeShow = false;
          },
        }
}

</script>
