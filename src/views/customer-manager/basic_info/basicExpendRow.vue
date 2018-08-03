
  <style scoped>
   .expand-row{
     margin-bottom: 16px;
   }
</style>

  <template>
    <div>
      <Row class="expand-row">
        <Col span="8" >
        <span class="expand-key" >负责人姓名: </span>
        <span class="expand-value" >{{ row.ManagerMobile }}</span>
        </Col>
        <Col span="8" >
        <span class="expand-key" >负责人电话: </span>
        <span class="expand-value" >{{ row.ManagerMobile }}</span>
        </Col>
        <Col span="8" >
        <span class="expand-key" >负责人邮箱: </span>
        <span class="expand-value" >{{ row.ManagerEmail }}</span>
        </Col>
      </Row>
      <Row class="expand-row">
        <Col span="8" >
          <span class="expand-key" >客户地址: </span>
          <span class="expand-value" >{{ row.Cus_Address }}</span>
        </Col>
        <Col span="8" >
          <span class="expand-key" >备注: </span>
          <span class="expand-value" >{{ row.Remark }}</span>
        </Col>

      </Row>

    </div>
  </template>
  <script>
    export default {
      props: {
        row: Object
      },
      data(){
        return {

        }
      
      },
      mounted(){

      },

      methods: {}
    };
  </script>


