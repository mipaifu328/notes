/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2021-12-27 09:27:45
 * @LastEditors: mipaifu328
 * @LastEditTime: 2021-12-28 10:43:56
 */

Vue.use = function (plugin) {
  // 插件缓存
  const installedPlugins =
    this._installedPlugins || (this._installedPlugins = [])

  if (installedPlugins.includes(plugin)) {
    //已有插件，则返回
    return this
  }

  // 获取参数, vue + 其他传入参数
  const args = [this, ...[...arguments].slice(1)]

  if (typeof plugin.install === 'function') {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === 'function') {
    plugin.apply(null, args)
  }

  // 缓存插件
  this._installedPlugins.push(plugin)

  return this
}
