<style scoped>
.sim-status-wrapper{
  width:100px;
  height:100px;
  border-radius:50px;
  border:8px solid #f4bd00;
  margin-left:50px;
}
.sim-status-content{
 margin-top:25px;
}
.sim-status-content p{
  text-align:center;
}
.sim-info-wrapper{
padding-top:20px;
}
.sim-info-wrapper>div{
  line-height:30px;
}


.center-text{
  text-align:center;
  padding:10px 0;
}
.bold-text{
  font-weight:bold;
}
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    <div>
      <Row style="background-color: #f7f9fc;padding:20px;margin-bottom:20px;">
        <Col span="12" >
          <div class="sim-status-wrapper">
            <div class="sim-status-content">
              <p style="font-weight:bold;font-size:14px;">{{modalForm.SimStatus}}</p>
              <p style="font-size:12px;color:#8a8a8a;">SIM卡状态</p>
            </div>
          </div>
        </Col>
        <Col span="12">
          <div class="sim-info-wrapper">
            <div>SIM卡号：{{modalForm.SimNum}}</div>
            <div>流量池编号：{{modalForm.PoolNum}}</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="8" class="center-text bold-text">
          当月已用用量
        </Col>
        <Col span="8" class="center-text bold-text">
          池剩余流量
        </Col>
        <Col span="8" class="center-text bold-text">
          池总流量
        </Col>
      </Row>
      <Row>
        <Col span="8" class="center-text">
          {{pool_already}}(MB)
        </Col>
        <Col span="8" class="center-text">
          {{pool_left}}(MB)
        </Col>
        <Col span="8" class="center-text">
          {{pool_total}}(MB)
        </Col>
      </Row>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getSimCardDetail} from './../../../api/getData'
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
          simCardDetail:{
            PoolInfo:[],
            SvcCont:[{pool_already:3,pool_left:100,pool_total:103}]
          },
        }
    },
    computed:{
      pool_already:function () {
        return (parseInt(this.simCardDetail.SvcCont[0].pool_already)/1024).toFixed(2);
      },
      pool_left:function () {
        return (parseInt(this.simCardDetail.SvcCont[0].pool_left)/1024).toFixed(2);
      },
      pool_total:function () {
        return (parseInt(this.simCardDetail.SvcCont[0].pool_total)/1024).toFixed(2);
      },
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm = Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if (curVal){
          this.getSimCardDetail();
        }
      }
    },
    created(){
     // this.getRoleComboList();
    },
    mounted(){
    
    },
    methods: {
      async getSimCardDetail(){
        this.simCardDetail=await getSimCardDetail(this.modalForm);
        console.log(this.simCardDetail)
      },
      cancel() {
          this.$emit('listenModalForm');
      },
    }
}

</script>
