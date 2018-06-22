<style lang="less">
    @import './own-space.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form 
                    ref="userForm"
                    :model="userForm" 
                    :label-width="100" 
                    label-position="right"
                    :rules="inforValidate"
                >
                    <FormItem label="用户姓名：" >
                        <span>{{ userForm.name }}</span>
                    </FormItem>
                    <FormItem label="登录名：" >
                        <span>{{ userForm.loginName }}</span>
                    </FormItem>
                    <FormItem label="用户手机："  >
                        <span>{{ userForm.cellphone }}</span>
                    </FormItem>
                    <FormItem label="角色：">
                        <span>{{ userForm.RoleName }}</span>
                    </FormItem>
                    <FormItem v-if="IsAdmin" label="余额：">
                        <span>{{ userForm.RestCash }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="text" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal"
               :closable='false'
               :mask-closable=false
               :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" type="password" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" type="password" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" type="password" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="ghost"  @click="cancel" >取消</Button>
                <Button type="primary"  :loading="btnLoading" @click="comfirmEditPass">提交</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import { mapState } from 'vuex'
import {editUserPwd,GetCustomer} from './../../api/getData'

export default {
    name: 'ownspace_index',
    data () {
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
            } else {
                callback();
            }
        };
        return {
            userForm: {
                name: '',
              loginName:'',
                cellphone: '',
                RoleName: '',
              RestCash:''
            },
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            btnLoading:false,
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
        };
    },
  computed: {
    ...mapState({
      adminInfo: state => state.user.adminInfo,
    }),
    IsAdmin: function () {
      return this.adminInfo.RoleName != "管理员";
    },
  },
  methods: {
        init () {
            this.userForm.name = this.adminInfo.Name;
            this.userForm.loginName = this.adminInfo.LoginName;
            this.userForm.cellphone = this.adminInfo.Phone;
            this.userForm.RoleName = this.adminInfo.RoleName;
            if(this.adminInfo.RoleName != "管理员"){
              this.GetCustomer(this.adminInfo.Id);
            }
        },
        async GetCustomer(userId){
         const params = {userId:userId}
         const res = await GetCustomer(params);
        },
    
        showEditPassword(){
          this.editPasswordModal=true;
        },
        cancel() {
          this.editPasswordModal=false;
        },
        comfirmEditPass(){
          this.$refs['editPasswordForm'].validate( async (valid) => {
            if (valid) {
              this.btnLoading=true;
              try{
                let params = JSON.parse(JSON.stringify(this.editPasswordForm))
                params.Id=this.adminInfo.Id;
                const res= await editUserPwd(params);
                if (res.success) {
                  this.$Message.success('修改成功!');
                  this.editPasswordModal=false;
                }else{
                  this.$Message.error(res.msg);
                }
              }catch(err){
                console.log(err);
                this.$Message.error('服务器异常，稍后再试');
              }
              this.btnLoading=false;
            } else {
              this.$Message.error('表单验证失败!');
            }
          })
         
        },
    },
    mounted () {
        this.init();
    }
};
</script>
