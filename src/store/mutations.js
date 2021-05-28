export default {
  addCounter(state,payload) {
    payload.count++
  },
  addToCart(state,payload) {
    payload.checked = true
    state.cartList.push(payload)
  },
  check(state, payload) {
    state.cartList[payload].checked = !state.cartList[payload].checked
  }
}
