<style scoped>

</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="设置权限"
    @on-cancel="cancel"
    width="400">
    <Tree ref="roleTree" :data="baseData" show-checkbox></Tree>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveTree">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {roleTree,setRoleTree} from './../../../api/getData'
export default {
    props:{
      roleId: {
        type: Number,
        default: 0,
      },
      treeShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm_loading:false,
          baseData: [{
            expand: true,
            title: 'parent 1',
            children: [{
              title: 'parent 1-0',
              expand: true,
              disabled: true,
              children: [{
                title: 'leaf',
                disableCheckbox: true
              }, {
                title: 'leaf',
              }]
            }, {
              title: 'parent 1-1',
              expand: true,
              checked: true,
              children: [{
                title: '<span style="color: red">leaf</span>',
              }]
            }]
          }],
        }
    },
    watch:{
      treeShow(curVal,oldVal){
        this.IsModalShow = curVal;
      },
      IsModalShow(curVal,oldVal){
         if (curVal){
           this.getRoleTree();
         }
      }
    },
    mounted(){

    },
    methods: {
      cancel() {
          this.$emit('listenModalTree');
      },
      async getRoleTree(){
        let res= await roleTree({Id:this.roleId});
        res.forEach((value, index)=>{
          if (value.children&&value.children.length>0){
            value.checked =false;
          }
        });
        this.baseData=res;
      },
      async saveTree() {
            let params={
              Function:'',
              Action:'',
              roleId:'',
            };
            const checkedNodes = this.$refs['roleTree'].getCheckedNodes();
            
            checkedNodes.forEach((value, index)=>{
                  if (value.type ===0 ){
                    params.Function+=value.id+',';
                  }else{
                    params.Action+=value.id+',';
                  }
            });
            this.baseData.forEach((value, index)=>{
                if (value.children&&value.children.length>0&&value.indeterminate){
                  params.Function+=value.id+',';
                }
            });
            params.roleId = this.roleId;
            this.modalForm_loading=true;
            try{
              let result = await setRoleTree(params);
              if (result.success) {
                this.$Message.success('提交成功!');
                this.$emit('listenModalTree');
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
