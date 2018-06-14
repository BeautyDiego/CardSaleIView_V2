<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false" style="background-color: rgba(255,255,255,0.6);">
                <div style="text-align: center;">
                    <img src="./../images/loginChaoda.png" alt="" style="width:245px;">
                </div>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名" size="large">
                            <span slot="prepend">
                                    <Icon :size="20" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码" size="large">
                            <span slot="prepend">
                                    <Icon :size="20" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long :loading="isLoading" shape="circle" size="large" :disabled="isLoading">登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
  import Cookies from 'js-cookie'
  import {login} from './../api/getData'

  export default {
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        isLoading:false,
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.form));
            this.isLoading=true;
            this.$Loading.start();
            let pwd=this.form.password;
            try{
              let result = await login(params);
              if (result.success) {
                this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg')
                this.$store.commit('login', result.result)
                Cookies.set('password', pwd)
                this.isLoading=false;
                this.$Loading.finish();
                this.$Message.success('提交成功!');
                this.$router.push({
                  name: 'home_index'
                })
              }else{
                this.isLoading=false;
                this.$Loading.error();
                this.$Message.error(result.msg);
              }
            }catch(err){
              this.isLoading=false;
              this.$Loading.error();
              console.log(err)
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      }
    }
  }
</script>

<style>

</style>
