/*
      防抖动函数的作用过程
        如果我们直接执行refresh，那么refresh函数会被执行30次
        可以将refresh函数传入到debounce函数中，生成一个新的函数
        之后在调用非常频繁的时候，就使用新生成的函数
        而新生成的函数并不会非常的频繁的调用，如果下一次执行来的非常快，那么会将上一次取消掉
    * */
export function debounce(func , delay=200) {
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    },delay)
  }
}

//对时间戳进行格式化
export function formatDate(date, fmt) {
  //获取年份
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+' : date.getMonth() + 1,
    'd+' : date.getDate(),
    'h+' : date.getHours(),
    'm+' : date.getMinutes(),
    's+' : date.getSeconds()
  }
  for(let k in o){
    if(new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
