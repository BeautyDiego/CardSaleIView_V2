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

/**cmccTable **/
#cmccTable{width:100%;color:#808080;}
#cmccTable th,#cmccTable td{line-height:19px;padding:7px 8px;font-size:12px;}
#cmccTable th{white-space:nowrap;}
#cmccTable th,#cmccTable td{border-width:0 0 1px 1px;border-style:solid;border-color:#dcdcdc;text-align:center;}
#cmccTable th{border-top:1px solid #dcdcdc;}
#cmccTable tr th:last-child,#cmccTable tr td:last-child{border-right:1px solid #dcdcdc;}
#cmccTable thead th{background-color:#f5f7fa;}
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <div>

      <!--3 代表是中国电信-->
      <div v-if="IsCT">
        <Row style="background-color: #f7f9fc;padding:20px;margin-bottom:20px;">
          <Col span="12" >
          <div class="sim-status-wrapper">
            <div class="sim-status-content">
              <p style="font-weight:bold;font-size:14px;">{{simCT.prodStatusName}}</p>
              <p style="font-size:12px;color:#8a8a8a;">SIM卡状态</p>
            </div>
          </div>
          </Col>
          <Col span="12">
          <div class="sim-info-wrapper">
            <div>SIM卡号：{{simCT.phoneNum}}</div>
            <div>地区：{{simCT.commonRegionName}}</div>
            <div>所属客户：{{simCT.custName}}</div>
            <div>产品名：{{simCT.productName}}</div>
          </div>
          </Col>
        </Row>
        <Row>
               <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="simCT.prodOfferInfos"></Table>
        </Row>
      </div>
      <!--2 代表是中国移动-->
      <div v-if="IsCMCC">
        <Row style="background-color: #f7f9fc;padding:20px;margin-bottom:20px;">
          <Col span="12" >
          <div class="sim-status-wrapper">
            <div class="sim-status-content">
              <p style="font-weight:bold;font-size:14px;">{{simCMCC.status}}</p>
              <p style="font-size:12px;color:#8a8a8a;">SIM卡状态</p>
            </div>
          </div>
          </Col>
          <Col span="12">
          <div class="sim-info-wrapper">
            <div>SIM卡号：{{simCMCC.msisdn}}</div>
            <div>开户时间：{{CMCCDateFormat(simCMCC.openTime)}}</div>
          </div>
          </Col>
        </Row>
        <Row>
          <table id="cmccTable">
            <thead>
            <tr>
              <th>套餐名称</th>
              <th>套餐编码</th>
              <th>套餐状态</th>
              <th>套餐生效时间</th>
              <th>套餐失效时间</th>
            </tr>
            </thead>
            <tbody >
                <tr v-for="item in simCMCC.packages.list ">
                  <td>{{item.pkgName}}</td>
                  <td>{{item.pkgCode}}</td>
                  <td>{{item.pkgStatus}}</td>
                  <td>{{CMCCDateFormat(item.pkgEfftTime) }}</td>
                  <td>{{CMCCDateFormat(item.pkgExpireTime)}}</td>
                </tr>
            </tbody>
          </table>
        </Row>
      </div>
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
          simCT:{
              attrInfos: [],
              commonRegionName: "珠海市",
              custName: "广东潮图电子商务有限公司",
              funProdInfos:[{productName:'',attrInfos:[]}],
              phoneNum: "1064917011657",
              prodOfferInfos:[],
              prodStatusName: "未激活",
              productName: "乐通（流量）",
              stopFlag: "1",
          },
          simCMCC:{
              apnList: [],
              lowPowerMode: "-",
              mainProdCode: "AppendAttr.I00010300001",
              msisdn: "1440047228318",
              openTime: "20180424181242",
              packages:{list:[]},
              productCode: "50314000117",
              rautauTimer: "-",
              status: "停机",
              statusTime: "20180526024535",
          },
          tableColums: [
          {
            align:'center',
            title: '套餐名称',
            key: 'prodOfferName',
          },{
            align:'center',
            title: '套餐状态',
            key: 'statusName',
          },{
            align:'center',
            title: '生效时间',
            key: 'startDt',
          },{
            align:'center',
            title: '失效时间',
            key: 'endDt',
          }]
        }
    },
    computed:{
//      pool_already:function () {
//        return (parseInt(this.simCT.SvcCont[0].pool_already)/1024).toFixed(2);
//      },
//      pool_left:function () {
//        return (parseInt(this.simCT.SvcCont[0].pool_left)/1024).toFixed(2);
//      },
//      pool_total:function () {
//        return (parseInt(this.simCT.SvcCont[0].pool_total)/1024).toFixed(2);
//      },
      IsCT:function () {
          return this.modalForm.OperType==1
      },
      IsCMCC:function () {
          return this.modalForm.OperType==2
      }
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
 
          let res =await getSimCardDetail({simNum:this.modalForm.SimNum});
          console.log(res)
          if (this.IsCMCC){
              this.simCMCC=JSON.parse(res.data);
              console.log( this.simCMCC)
          }
          if (this.IsCT){
              this.simCT=res.SvcCont.result.prodInfos;
          }

      },
      cancel() {
          this.$emit('listenModalForm');
      },
      CMCCDateFormat(date){
          return date.substr(0,4)+'-'+date.substr(4,2)+'-'+date.substr(6,2)+' '+date.substr(8,2)+':'+date.substr(10,2)+':'+date.substr(12,2)
      },
    }
}

</script>
