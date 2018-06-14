<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .upload-list{
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);

  }
  .upload-list img{
    width: 100%;
    height: 100%;
  }
  .upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
    display: block;
  }
  .upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">收货人: </span>
      <span class="expand-value">{{ row.ReceiveName }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">收货电话: </span>
      <span class="expand-value">{{ row.ReceiveMobile }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">收货地址: </span>
      <span class="expand-value">{{ row.ReceiveAddress }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">流量池编号: </span>
      <span class="expand-value">{{ row.PoolNum }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">快递编号: </span>
      <span class="expand-value">{{ row.DeliveryNum }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">快递公司: </span>
      <span class="expand-value">{{ row.DeliveryName }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">支付方式: </span>
      <span class="expand-value">{{ row.PayModeTxt }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">支付时间: </span>
      <span class="expand-value">{{ row.PayTime }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">银行流水号: </span>
      <span class="expand-value">{{ row.BankFlowNum }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">是否开票: </span>
      <span class="expand-value">{{ row.IsInvoicedTxt }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">发票编号: </span>
      <span class="expand-value">{{ row.InvoiceNum }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">备注: </span>
      <span class="expand-value">{{ row.Remark }}</span>
      </Col>
    </Row>
    <Row  v-if="row.RemittanceUrl">
      <Col span="8">
      <span class="expand-key">汇款凭证: </span>
      <span class="expand-value">
        <div class="upload-list" >
            <template >
              <img :src="row.RemittanceUrl">
              <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView()"></Icon>
              </div>
            </template>
        </div>
      </span>
      </Col>
      <Col span="8">
      <span class="expand-key">汇款人电话: </span>
      <span class="expand-value">{{ row.RemittancePhone }}</span>
      </Col>
    </Row>
    <Modal title="汇款单凭证" v-model="visible">
      <img :src="row.RemittanceUrl" v-if="visible" style="width: 100%">
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      handleView () {
        this.visible = true
      }
    }
  }
</script>