<style scoped>
.sim-status-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border: 8px solid #f4bd00;
  margin-left: 50px;
}
.sim-status-content {
  margin-top: 25px;
}
.sim-status-content p {
  text-align: center;
}
.sim-info-wrapper {
  padding-top: 20px;
}
.sim-info-wrapper > div {
  line-height: 30px;
}

.center-text {
  text-align: center;
  padding: 10px 0;
}
.bold-text {
  font-weight: bold;
}

.siminfo-title {
  line-height: 30px;
  padding-left:5px;
}

/**infoTable **/
.infoTable {
  width: 100%;
  color: #808080;
}
.infoTable th,
.infoTable td {
  line-height: 19px;
  padding: 7px 8px;
  font-size: 12px;
}
.infoTable th {
  white-space: nowrap;
}
.infoTable th,
.infoTable td {
  border-width: 0 0 1px 1px;
  border-style: solid;
  border-color: #dcdcdc;
  text-align: center;
}
.infoTable th {
  border-top: 1px solid #dcdcdc;
}
.infoTable tr th:last-child,
.infoTable tr td:last-child {
  border-right: 1px solid #dcdcdc;
}
.infoTable thead th {
  background-color: #f5f7fa;
}
</style>

<template>

  <div>

    <Modal v-model="IsModalShow" :title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="700">
      <div>

        <!--3 代表是中国电信-->
        <div v-if="IsCT">
            <Spin size="large" fix v-if="spining"></Spin>
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
              <!--<div>地区：{{simCT.commonRegionName}}</div>-->
              <!--<div>所属客户：{{simCT.custName}}</div>-->
              <!--<div>产品名：{{simCT.productName}}</div>-->
            </div>
            </Col>
          </Row>
          <Row>
            <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="CTTableData"></Table>
          </Row>
         
        </div>
        <!--2 代表是中国移动-->
        <div v-if="IsCMCC">
            <Spin size="large" fix v-if="spining"></Spin>
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
            <div class="siminfo-title">套餐详情</div>
            <table class="infoTable">
              <thead>
                <tr>
                  <th>套餐名称</th>
                  <th>套餐编码</th>
                  <th>套餐状态</th>
                  <th>套餐生效时间</th>
                  <th>套餐失效时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in simCMCC.packages.list " :key="index">
                  <td>{{item.pkgName}}</td>
                  <td>{{item.pkgCode}}</td>
                  <td>{{item.pkgStatus}}</td>
                  <td>{{CMCCDateFormat(item.pkgEfftTime) }}</td>
                  <td>{{CMCCDateFormat(item.pkgExpireTime)}}</td>
                </tr>
              </tbody>
            </table>
          </Row>
          <Row>
            <div class="siminfo-title">历史流量</div>
            <div>
              <table class="infoTable">
                <thead>
                  <tr>
                    <th>月份</th>
                    <th>使用流量(MB)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in CMhisFlowList " :key="index">
                    <td>{{item.month}}</td>
                    <td>{{item.usedFlow}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Row>
        </div>
        <!--3 代表是中国联通-->
        <div v-if="IsCU">
            <Spin size="large" fix v-if="spining"></Spin>
          <Row style="background-color: #f7f9fc;padding:20px;margin-bottom:20px;">
            <div style="text-align:center;">
              <div>SIM卡ICCID：{{modalForm.ICCUID}}</div>
            </div>
          </Row>
          <Row>
            <div class="siminfo-title">历史流量</div>

            <table class="infoTable" v-if="IsCU">
              <thead>
                <tr>
                  <th>月份</th>
                  <th>使用流量(MB)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in CUhisFlowList " :key="index">
                  <td>{{item.month}}</td>
                  <td>{{(item.dataUsage/1024/1024).toFixed(2)}}</td>
                </tr>
              </tbody>
            </table>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click="cancel">关闭</Button>
      </div>
    </Modal>

  </div>

</template>

<script>
import {
  getSimCardDetail,
  getSimCardHisFlowUsage
} from "./../../../api/getData";
export default {
  props: {
    parentForm: {
      type: Object,
      default: function() {
        return {
          Id: "",
          SimNum: "",
          PoolNum: "",
          Remark: ""
        };
      }
    },
    modalShow: {
      type: Boolean,
      default: true
    },
    modalFormTitle: {
      type: String,
      default: "查看详情"
    }
  },
  data() {
    return {
      IsModalShow: false,
      modalForm: {},
      modalForm_loading: false,
      simCT: {
        attrInfos: [],
        commonRegionName: "珠海市",
        custName: "广东潮图电子商务有限公司",
        funProdInfos: [{ productName: "", attrInfos: [] }],
        phoneNum: "1064917011657",
        prodOfferInfos: [],
        prodStatusName: "未激活",
        productName: "乐通（流量）",
        stopFlag: "1"
      },
      simCMCC: {
        apnList: [],
        lowPowerMode: "-",
        mainProdCode: "AppendAttr.I00010300001",
        msisdn: "1440047228318",
        openTime: "20180424181242",
        packages: { list: [] },
        productCode: "50314000117",
        rautauTimer: "-",
        status: "停机",
        statusTime: "20180526024535"
      },
      tableColums: [
        {
          align: "center",
          title: "套餐名称",
          key: "prodOfferName"
        },
        {
          align: "center",
          title: "套餐状态",
          key: "statusName"
        },
        {
          align: "center",
          title: "生效时间",
          key: "startDt"
        },
        {
          align: "center",
          title: "失效时间",
          key: "endDt"
        }
      ],
      CUhisFlowList: [],
      CMhisFlowList: [{ month: "201807", usedFlow: "0.025" }],
      spining:false
    };
  },
  computed: {
    IsCT: function() {
      return this.modalForm.OperType == 1;
    },
    IsCMCC: function() {
      return this.modalForm.OperType == 2;
    },
    IsCU: function() {
      return this.modalForm.OperType == 3;
    },
    CTTableData: function() {
      if (
        Object.prototype.toString.call(this.simCT.prodOfferInfos) ===
        "[object Array]"
      ) {
        return this.simCT.prodOfferInfos;
      } else {
        return [this.simCT.prodOfferInfos];
      }
    }
  },
  watch: {
    modalShow(curVal, oldVal) {
      this.modalForm = Object.assign(this.parentForm);
      console.log(this.modalForm);
      this.IsModalShow = curVal;
      if (curVal) {
        this.getSimCardDetail();
        this.getFlowUsage();
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    async getSimCardDetail() {
      if (this.IsCMCC) {
        let res = await getSimCardDetail({ simNum: this.modalForm.SimNum });
        let result = JSON.parse(res.data);
        if (result.packages.list) {
          this.simCMCC = result;
        } else {
          this.$Message.error("此卡不存在，请联系管理员校验");
        }
      }
      if (this.IsCT) {
        let res = await getSimCardDetail({ simNum: this.modalForm.SimNum });
        this.simCT = res.SvcCont.result.prodInfos;
        console.log(this.simCT);
      }
    },
    async getFlowUsage() {
      this.spining=true;
      let today = new Date();
      let fullYear = today.getFullYear();
      let month = today.getMonth();
      if (this.IsCU) {
        this.CUhisFlowList = [];
        let CUtempArr = [];
        for (let i = 0; i < 3; i++) {
          let paramMonth = month + 1 - i;
          let paramYear = fullYear;
          if (paramMonth < 1) {
            paramMonth = paramMonth + 12;
            paramYear = paramYear - 1;
          }

          paramMonth = paramMonth > 9 ? paramMonth : "0" + paramMonth;
          let res = await getSimCardHisFlowUsage({
            simNum: this.modalForm.SimNum,
            iccid: this.modalForm.ICCUID,
            month: `${paramYear}-${paramMonth}-01`
          });
          // res 数据格式
          //    {
          //   iccid: "89860618050000200543",
          //   timeStamp: "2018-09-26T03:02:18.393Z",
          //   cycleStartDate: "2018-08-26T16:00:00.000Z",
          //   cycleEndDate: "2018-09-26T15:59:59.000Z",
          //   deviceCycleUsageInZones: {
          //     "620WLW005721_MON-FLEX_300M_SP, 1": [
          //       {
          //         ratePlan: "620WLW005721_MON-FLEX_300M_SP",
          //         ratePlanVersion: "1",
          //         zone: "620WLW005721_xz01gz_zone1",
          //         dataUsage: 61489152,
          //         dataUsageUnit: "bytes",
          //         voiceMTUsage: null,
          //         voiceMTUsageUnit: null,
          //         voiceMOUsage: null,
          //         voiceMOUsageUnit: null,
          //         smsmtusage: null,
          //         smsmousage: null
          //       }
          //     ]
          //   }
          // }
          let dateArr = res.cycleEndDate.split("-");
          let CUmonth = `${dateArr[0]}-${dateArr[1]}`;
          let dataUsage = 0;
          Object.keys(res.deviceCycleUsageInZones).forEach(function(key) {
            dataUsage += res.deviceCycleUsageInZones[key][0].dataUsage;
          });
          CUtempArr.push({ month: CUmonth, dataUsage: dataUsage });
        }
        this.CUhisFlowList = CUtempArr;
      }

      if (this.IsCMCC) {
        this.CMhisFlowList = [];
        let CMtempArr=[];
        for (let i = 0; i < 6; i++) {
          let paramMonth = month + 1 - i;
          let paramYear = fullYear;
          if (paramMonth < 1) {
            paramMonth = paramMonth + 12;
            paramYear = paramYear - 1;
          }
          paramMonth = paramMonth > 9 ? paramMonth : "0" + paramMonth;
          let res = await getSimCardHisFlowUsage({
            simNum: this.modalForm.SimNum,
            iccid: this.modalForm.ICCUID,
            month: `${paramYear}${paramMonth}`
          });
          let apnInfo = JSON.parse(res.data).apnInfo;
          if (apnInfo.length > 0) {
            let cmMonth = apnInfo[0].monthlyList.list[0].month;
            CMtempArr.push({
              month: cmMonth.substr(0,4)+'-'+cmMonth.substr(4,6),
              usedFlow: apnInfo[0].monthlyList.list[0].usedFlow
            });
          }
        }
         this.CMhisFlowList = CMtempArr;
      }
          this.spining=false;
    },

    cancel() {
      this.$emit("listenModalForm");
    },
    CMCCDateFormat(date) {
      if (date.length > 12) {
        return (
          date.substr(0, 4) +
          "-" +
          date.substr(4, 2) +
          "-" +
          date.substr(6, 2) +
          " " +
          date.substr(8, 2) +
          ":" +
          date.substr(10, 2) +
          ":" +
          date.substr(12, 2)
        );
      } else {
        return "";
      }
    }
  }
};
</script>
