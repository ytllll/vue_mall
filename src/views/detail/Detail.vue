<template>
  <div id="detail">
    <detail-nav-bar/>
    <detail-swiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";

import {getDetail, Goods, Shop} from "@/network/detail";

export default {
  name: "Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo
  },
  data() {
    return {
      iid:null,
      topImages:[],
      goods: {},
      shop:{}
    }
  },
  created() {
    //1.保存iid
    this.iid = this.$route.params.iid
    //2.根据iid请求数据
    getDetail(this.iid).then(res => {
      console.log(res)
      const data = res.result
      //1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages
      //2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns, data.shopInfo.services)
      //3.获取商家信息
      this.shop = new Shop(data.shopInfo)
    })
  },
  activated() {

  }
}
</script>

<style scoped>

</style>
