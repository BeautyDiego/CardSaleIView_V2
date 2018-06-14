
  <style scoped>
   .expand-row{
     margin-bottom: 16px;
   }
</style>

  <template>
    <div>
      <Row class="expand-row">
        <Col span="8" style="text-align: center">
        <span class="expand-key" >总流量: </span>
        <span class="expand-value" >{{ ExpandData.total }}</span>
        </Col>
        <Col span="8" style="text-align: center">
        <span class="expand-key" >已使用流量: </span>
        <span class="expand-value" style="color:red;">{{ ExpandData.used }}</span>
        </Col>
        <Col span="8" style="text-align: center">
        <span class="expand-key" >剩余流量: </span>
        <span class="expand-value" style="color:green">{{ ExpandData.left }}</span>
        </Col>
      </Row>

    </div>
  </template>
  <script>
    import {queryPoolUsed} from './../../../api/getData'
    export default {
      props: {
        row: Object
      },
      data(){
        return {
          ExpandData:{}
        }
      
      },
      mounted(){
        this.getInterfaceData();
      },

      methods:{
       async getInterfaceData()
        {
          const params = {PoolNum:this.row.PoolNum}
          const res = await queryPoolUsed(params);
          if(res.success){

            this.ExpandData=res.result;
          }
        }
      }
    };
  </script>


