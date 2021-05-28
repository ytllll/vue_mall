<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" class="check-button" @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="totalPrice">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";
import {mapGetters} from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      if(this.cartList.length === 0) return false
      //1.使用filter
      // return !(this.cartList.filter(item => !item.checked).length)
      //2.使用find
      return !(this.cartList.find(item => !item.checked))
      //3.普通遍历
      // for(let item in this.cartList) {
      //   if(!item.checked){
      //     return false
      //   }
      // }
      // return true
    }
  },
  methods: {
    checkClick() {
      if(this.isSelectAll){  //全部选中
        this.cartList.forEach(item => item.checked = false)
      }else { //部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if(!this.isSelectAll) {
        this.$toast.show('请选择商品',2000)
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar{
    height: 40px;
    background-color: #eee;
    position: relative;
    top: 534px;
    line-height: 40px;
    display: flex;
  }
  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-button{
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .totalPrice{
    margin-left: 30px;
    flex: 1;
  }
  .calculate{
    width: 100px;
    background-color: red;
    text-align: center;
    color: #fff;
  }
</style>
