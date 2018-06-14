<style scoped>
  #icons{
    height:600px;
    overflow: auto;
    zoom: 1;
  }
.icons-item{
  float: left;
  margin: 6px 6px 6px 0;
  width: 125px;
  text-align: center;
  list-style: none;
  cursor: pointer;
  height: 70px;
  color: #5c6b77;
  transition: all .2s ease;
  position: relative;
  padding-top: 10px;
}
  .icons-item:hover{
    background-color:#FF7F00;
  }
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalTitle"
    @on-cancel="cancel"
    width="1100">
    <div>
      <div data-v-4ed37512="" id="icons">
        <div  class="icons-item" v-for="(item, index) in icons"  :key="index" @click="saveIcon(item)">
          <Icon :type="item" size="32"></Icon>
          <p>{{item}}</p>
        </div>
      </div>
    </div>
    <div slot="footer">
    </div>
  </Modal>

</div>

</template>

<script>
  import $ from './jquery-2.0.0.min';
  import {Icons} from './Icons'
export default {
    props:{
      modalShow:{
        type: Boolean,
        default: false,
      },
    },
    data() {
        return {
          icons:[],
          IsModalShow:false,
          modalTitle:'图标选择',
        }
    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
      }
    },
  mounted () {
    this.icons=Icons
  },
    methods: {
      cancel() {
          this.$Message.success('这是一条成功的提示');
          this.$emit('listenModalIcon');
      },
      saveForm() {
          this.$Message.warning('这是一条警告的提示');
      },
      saveIcon(icon){
        this.$emit('listenChildIcon',icon);
      }
    }
}

</script>
