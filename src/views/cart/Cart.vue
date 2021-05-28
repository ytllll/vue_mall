<template>
  <div class="cart">
    <!--  导航  -->
    <nav-bar class="cart-nav"><div slot="center">购物车({{cartLength}})</div></nav-bar>
    <scroll class="content" ref="scroll">
      <!--  商品列表  -->
      <cart-list />
    </scroll>
    <!--  底部汇总  -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";

import Scroll from "@/components/common/scroll/Scroll";

import {mapGetters} from 'vuex';

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar,
    Scroll
  },
  computed: {
    /* mapGetters辅助函数仅仅是将store中的getters映射到局部计算属性 */
    ...mapGetters(['cartLength'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart {
    height: 100vh;
  }
  .cart-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 89px;
    left: 0;
    right: 0;
  }
</style>
