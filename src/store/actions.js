export default {
  addCart({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      //1.payload新添加的商品
      //查找之前数组中是否有该商品
      let oldProduct = state.cartList.find(item => item.iid === payload.iid)

      if(oldProduct) {
        // oldProduct.count += 1
        commit('addCounter', oldProduct)
        resolve('当前的商品数量+1')
      }else {
        payload.count = 1
        // state.cartList.push(payload)
        commit('addToCart', payload)
        resolve('添加了新的商品')
      }
    })
  }
}
