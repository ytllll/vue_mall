import {debounce} from "@/common/utils";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener:null,
      newRefresh:null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh,100)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad' , this.itemImgListener)
    // console.log('混入的内容')
  }
}
