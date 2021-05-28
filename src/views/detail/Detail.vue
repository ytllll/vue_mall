<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info ref="goods" :detail-info="detailInfo" @detailImgLoad="detailImgLoad" />
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop" class="back-top"/>
    <toast :message="message" :is-show="isShow"/>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";

import Scroll from "@/components/common/scroll/Scroll";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";
import Toast from "@/components/common/toast/Toast";

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "@/network/detail";
import {itemListenerMixin} from "@/common/mixin";
import {debounce} from "@/common/utils";

export default {
  name: "Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop,
    Toast
  },
  data() {
    return {
      iid:null,
      topImages:[],
      goods: {},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],
      themeTopYs:[],
      getThemeTopYs:null,
      currentIndex:0,
      isShowBackTop:false,
      backOffsetTop:0,
      message:'',
      isShow: false
    }
  },
  created() {
    //1.保存iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // console.log(res)
      const data = res.result
      //1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages
      //2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns, data.shopInfo.services)
      //3.获取商家信息
      this.shop = new Shop(data.shopInfo)
      //4.保存商品详情数据
      this.detailInfo = data.detailInfo
      //5.保存参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //6.取出评论的信息
      if(data.rate.cRate !== 0 ){
        this.commentInfo = data.rate.list[0]
      }

      //这个函数回等组件渲染完成之后回调
      // this.$nextTick(() => {
      //   //根据最新的数据，对应的DOM是已经被渲染出来了
      //   //但是图片依然没有加载完成
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs)
      // })
      //给getThemeTopYs赋值（对给this.themeTopYs的赋值操作进行防抖）
      this.getThemeTopYs = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        // console.log(this.themeTopYs)

        //给返回顶部的backOffsetTop设置高度
        this.backOffsetTop = this.$refs.goods.$el.offsetTop
      },100)

    })
    //3.请求推荐数据
    getRecommend().then(res => {
      // console.log(res.data.list)
      this.recommends = res.data.list
    })
  },
  methods:{
    detailImgLoad(){
      // this.$refs.scroll.refresh()
      this.newRefresh()
      this.getThemeTopYs()
    },
    titleClick(index){
      // console.log(index)
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position){
      //获取y值
      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++){
        // if(this.currentIndex != i && ((i < length -1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||(i === length -1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex = i
        //   // console.log(this.currentIndex)
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }
        if(this.currentIndex != i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }

      //2.判断BackTop是否显示
      // console.log(position)
      this.isShowBackTop = (-position.y) > this.backOffsetTop
    },
    backClick(){
      // console.log('backClick')
      this.$refs.scroll.scrollTo(0, 0)
    },
    addToCart() {
      // console.log('添加购物车')
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2.将商品添加到购物车
      this.$store.dispatch('addCart', product).then(res => {
        // this.message = res
        // this.isShow = true
        //
        // setTimeout(() => {
        //   this.isShow = false
        //   this.message = ''
        // },1500)
        this.$toast.show(res, 1500)
      })
    }
  },
  mixins:[itemListenerMixin],
  mounted() {
  },
  destroyed() {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content{
    height: calc(100% - 44px - 58px);
  }

  .back-top {
    position: fixed;
    right: 7px;
    bottom: 58px;;
  }
</style>
