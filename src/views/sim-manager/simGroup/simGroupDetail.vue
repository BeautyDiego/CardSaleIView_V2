<style scoped>

</style>

<template>
  
  <div>
    
    <Modal
            v-model="IsModalShow"
            title="SIM卡组员信息"
            :mask-closable="false"
            @on-cancel="cancel"
            width="600">

        <Row>
          <Table stripe size="small"
                 height="478"
                 :columns="tableColums"
                 :data="GroupTableData"
                 ></Table>
        </Row>
        <Row style="text-align:center">
        共{{GroupTableData.length}}条
        </Row>
      <div slot="footer">
        <Button type="ghost"  @click="cancel" >关闭</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import {simGroupSimCardList} from './../../../api/getData'
  import formatter from './../../../libs/formatter'
  export default {
    props:{
      parentForm: {
        type: Object,
        default: function () {
          return {
            Id:'',
            GroupName: '',
            GroupDescribe: '',
            Remark:'',
            IsBind:false,
            PoolNum:'',
          }
        }
      },
      modalShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        IsModalShow:false,
        modalForm:{
        },
        modalForm_loading:false,
        tableLoading:false,
        tableColums: [
          {
            align:'center',
            title: 'ICCID',
            key: 'ICCUID',
          },
            {
                align:'center',
                title: '运营商',
                key: 'OperName',
                render: (h, params) => {
                    const row = params.row;
                    const color = formatter.operNameColor(row.OperName);
                    const text = row.OperName;
                    return h('Tag', {
                        props: {
                            type: 'dot',
                            color: color
                        }
                    }, text);
                }
            },
          {
            align:'center',
            title: '卡状态',
            key: 'SimStatus',
              render: (h, params) => {
                  const row = params.row;
                  const color = formatter.simStatusColor(row.SimStatus);
                  const text = row.SimStatus;
                  return h('Tag', {
                      props: {
                          type: 'border',
                          color: color
                      }
                  }, text);
              }
          },
        ],
        GroupTableData:[],

      }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.modalForm=Object.assign(this.parentForm);
        this.IsModalShow = curVal;
        if (curVal){
          this.getSimGroupSimCardTableList();
        }
      }
    },
    created(){
    
    },
    mounted(){
      
    },
    methods: {
      async getSimGroupSimCardTableList(){
        const params = {SimGroupId:this.modalForm.Id};
        this.GroupTableData = await simGroupSimCardList(params);
      },
      cancel() {
        this.$emit('listenModalForm');
      },
    }
  }

</script>
