<style scoped>
  /**cmccTable **/
  #transationTable{width:100%;color:#808080;}
  #transationTable th,#transationTable td{line-height:19px;padding:7px 8px;font-size:12px;}
  #transationTable th{white-space:nowrap;}
  #transationTable th,#transationTable td{border-width:0 0 1px 1px;border-style:solid;border-color:#dcdcdc;text-align:center;}
  #transationTable th{border-top:1px solid #dcdcdc;}
  #transationTable tr th:last-child,#transationTable tr td:last-child{border-right:1px solid #dcdcdc;}
  #transationTable thead th{background-color:#f5f7fa;}
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    title="订单详情"
    :mask-closable="false"
    @on-cancel="cancel"
    width="700">
    <div>
      <Row v-if="transationDataList.length>0">
        <table id="transationTable">
          <thead>
          <tr>
            <th>卡号</th>
            <th>状态</th>
            <th>返回描述</th>
            <th>订单时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in transationDataList ">
            <td>{{item.msisdn}}</td>
            <td :style="{'color':StatusColorFormat(item.resultCode,item.resultDesc)}">{{CMCCStatusFormat(item.resultCode,item.resultDesc)}}</td>
            <td>{{item.resultDesc}}</td>
            <td>{{CMCCDateFormat(item.createTime)}}</td>
          </tr>
          </tbody>
        </table>
      </Row>
      <Row v-else>
            移动接口调用失败
      </Row>
    </div>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >取消</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {getTransationDetail} from './../../../api/getData'
export default {
    props:{
      transationId: {
          type: String,
          default: ''
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
        return {
          IsModalShow:false,
          transationDataList:[
              {
              checkState: "UNCHECK",
              createTime: "20180814110002",
              handleType: 5,
              msisdn: "1111111111",
              operType: 1,
              resultCode: "0",
              resultDesc: "SUCCESS"}
          ],
          modalForm_loading:false,
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        if (curVal){
            this.getTransationDetail();
        }

      }
    },
    created(){

    },
    mounted(){
    
    },
    methods: {
        async getTransationDetail(){
            let res =await getTransationDetail({orderNo:this.transationId});
            console.log(JSON.parse(res.data))
            if (res.code ==0){
                this.transationDataList=JSON.parse(res.data).orderDetails;
            console.log(  this.transationDataList)
            }else{
                this.transationDataList=[];
            }
        },
        CMCCDateFormat(date){
            return date.substr(0,4)+'-'+date.substr(4,2)+'-'+date.substr(6,2)+' '+date.substr(8,2)+':'+date.substr(10,2)+':'+date.substr(12,2)
        },
        CMCCStatusFormat(resultCode,resultDesc){
            if (resultCode==0&&resultDesc=="SUCCESS"){
                return '成功';
            }else{
                return '受理中';
            }
        },
        StatusColorFormat(resultCode,resultDesc){
            if (resultCode==0&&resultDesc=="SUCCESS"){
                return 'green';
            }else{
                return 'red';
            }
        },
        cancel() {
            this.$emit('listenModalForm');
        },
    }
}

</script>
