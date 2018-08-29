<style lang="less">
    @import './login.less';
    .login .ivu-input-wrapper .ivu-input{
        border-radius: 18px!important ;
    }
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <div>
                <div style="text-align: center;font-size:24px;font-weight:700;letter-spacing:2px;padding:20px 10px;color:#fff;">
                    <!--<img src="./../images/loginChaoda.png" alt="" style="width:245px;">-->
                    物联网连接管理平台
                </div>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules" >
                        <Row>
                            <Col span="6" style="font-size:18px;color:#fff;line-height:32px;">
                             用户名：
                            </Col>
                            <Col span="18">
                                <FormItem prop="userName" >
            
                                    <Input v-model="form.userName" placeholder="请输入用户名" size="medium" >
                                    </Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="6" style="font-size:18px;color:#fff;line-height:32px;">
                            密码：
                            </Col>
                            <Col span="18">
                            <FormItem prop="password" >
                                <Input type="password" v-model="form.password" placeholder="请输入密码" size="medium">
                                </Input>
                            </FormItem>
                            </Col>
                        </Row>
    
                        <Row>
                            <Col span="6" >
                              &nbsp
                            </Col>
                            <Col span="18">
                            <FormItem>
                                <Button @click="handleSubmit" type="primary" long :loading="isLoading" shape="circle" size="large" :disabled="isLoading">登&nbsp&nbsp录</Button>
                            </FormItem>
                            </Col>
                        </Row>
                       
                    </Form>
                </div>
            </div>
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

