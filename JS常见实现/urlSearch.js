/*
 * @Descripttion: 通过地址栏获取请求参数
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-08-30 10:43:39
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-08-30 10:57:44
 */

// URLSearchParam ：webApi ie不兼容
const searchParams = new URLSearchParams(location.search)
searchParams.get('keywords')    // 'keywords value'
searchParams.has('keywords')    // true

// es6
const searchParams = location.search.slice(1).split('&').reduce((total, curValue) => {
    const [key, value] = curValue.split('=')
    return {...total, [key]: value}
},{})
