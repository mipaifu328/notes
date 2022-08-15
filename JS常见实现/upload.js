/*
 * @Descripttion:
 * @version: 1.0
 * @Author: mipaifu328
 * @Date: 2022-08-08 17:25:59
 * @LastEditors: mipaifu328
 * @LastEditTime: 2022-08-12 14:40:43
 */

import SparkMD5 from 'spark-md5'
import http from '@/common/js/http'
import { Message } from 'element-ui'

const SIZE = 0.2 * 1024 * 1024

const Status = {
  wait: 'wait',
  // pause: "pause",
  uploading: 'uploading',
  error: 'error',
  done: 'done',
}
const UPLOAD_URL = 'http://localhost:3000/upload' // 文件切片上传
const VERIFY_URL = 'http://localhost:3000/verify' // 校验文件分片上传结果
const MERGE_URL = 'http://localhost:3000/merge' // 合并文件切片

// 文件切片
const createFileChunk = function(file, size = SIZE) {
  // 生成文件块
  const chunks = []
  let cur = 0
  while (cur < file.size) {
    chunks.push({ file: file.slice(cur, cur + size) })
    cur += size
  }
  return chunks
}

// 抽样hash
const calculateHashSample = async function(file) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    // 文件大小
    const size = file.size
    let offset = 2 * 1024 * 1024
    let chunks = [file.slice(0, offset)]
    // 前面100K
    let cur = offset
    while (cur < size) {
      // 最后一块全部加进来
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset))
      } else {
        // 中间的 前中后去两个字节
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid, mid + 2))
        chunks.push(file.slice(end - 2, end))
      }
      // 前取两个字节
      cur += offset
    }
    // 拼接
    reader.readAsArrayBuffer(new Blob(chunks))
    reader.onload = (e) => {
      spark.append(e.target.result)
      resolve(spark.end())
    }
  })
}
// 完整hash计算，若采用可以配合webWorker避免页面卡顿 【目前暂时采用hash抽稀】
const calculateHashSync = async function(chunks) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer()
    let progress = 0
    let count = 0

    const loadNext = (index) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(chunks[index].file)
      reader.onload = (e) => {
        // 累加器 不能依赖index，
        count++
        // 增量计算md5
        spark.append(e.target.result)
        if (count === chunks.length) {
          // 通知主线程，计算结束
          resolve(spark.end())
        } else {
          // 计算下一个
          loadNext(count)
        }
      }
    }
    // 启动
    loadNext(0)
  })
}

// 检验已上传文件切片
const verify = async function(filename, hash) {
  const data = await http.post(VERIFY_URL, { filename, hash })
  return data
}

// 上传文件切片
const uploadChunks = async function(uploadedList = [], chunks, file, fileHash) {
  const list = chunks
    .filter((chunk) => uploadedList.indexOf(chunk.hash) == -1)
    .map(({ chunk, hash, index }, i) => {
      const form = new FormData()
      form.append('chunk', chunk)
      form.append('hash', hash)
      form.append('filename', file.name)
      form.append('fileHash', fileHash)
      return { form, index, status: Status.wait }
    })
  // 并发发送
  try {
    const ret = await sendRequest(list, 6, chunks)
    if (uploadedList.length + list.length === chunks.length) {
      // 上传和已经存在之和 等于全部的再合并
      await mergeRequest(file, fileHash)
    }
  } catch (e) {
    // 上传有被reject的
    Message.error({
      type: 'error',
      showClose: true,
      message: '上传失败了,请重新上传！',
    })
  }
}

// 并发请求
const sendRequest = async function(urls, max = 6, chunks) {
  console.log(urls, max)

  return new Promise((resolve, reject) => {
    const len = urls.length
    let counter = 0
    const retryArr = []
    const start = async () => {
      // 有请求，有通道
      while (counter < len && max > 0) {
        max-- // 占用通道
        console.log(counter, 'start')
        const i = urls.findIndex(
          (v) => v.status == Status.wait || v.status == Status.error
        ) // 等待或者error
        if (!urls[i]) return
        urls[i].status = Status.uploading
        const form = urls[i].form
        const index = urls[i].index
        if (typeof retryArr[index] == 'number') {
          console.log(index, '开始重试')
        }
        http
          .post(UPLOAD_URL, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onProgress: createProgresshandler(chunks[index]),
          })
          .then(() => {
            urls[i].status = Status.done

            max++ // 释放通道
            urls[counter++].done = true
            if (counter === len) {
              resolve()
            } else {
              start()
            }
          })
          .catch(() => {
            // 初始值
            urls[i].status = Status.error
            if (typeof retryArr[index] !== 'number') {
              retryArr[index] = 0
            }
            // 次数累加
            retryArr[index]++
            // 一个请求报错3次的
            if (retryArr[index] >= 2) {
              return reject() // 考虑abort所有别的
            }
            console.log(index, retryArr[index], '次报错')
            // 3次报错以内的 重启
            chunks[index].progress = -1 // 报错的进度条
            max++ // 释放当前占用的通道，但是counter不累加

            start()
          })
      }
    }
    start()
  })
}

// 通知后台合并文件切片
const mergeRequest = async function(file, fileHash) {
  const res = await http.post(MERGE_URL, {
    filename: file.name,
    size: file.size,
    fileHash: fileHash,
  })
  if (res.code === 0) {
    Message.success({
      type: 'success',
      showClose: true,
      message: '文件上传成功！',
    })
  } else {
    Message.error({
      type: 'error',
      showClose: true,
      message: '上传失败了,请重新上传',
    })
  }
}

const createProgresshandler = function(item) {
  return (e) => {
    item.progress = parseInt(String((e.loaded / e.total) * 100))
  }
}

export const uploadFile = async function(file) {
  let chunks = createFileChunk(file)
  const hash = await calculateHashSample(file)

  // 判断文件是否存在,如果不存在，获取已经上传的切片
  const { uploaded, uploadedList } = await verify(file.name, hash)

  if (uploaded) {
    return Message.success('秒传:上传成功')
  }
  chunks = chunks.map((chunk, index) => {
    const chunkName = hash + '-' + index
    return {
      fileHash: hash,
      chunk: chunk.file,
      index,
      hash: chunkName,
      progress: uploadedList.indexOf(chunkName) > -1 ? 100 : 0,
      size: chunk.file.size,
    }
  })
  console.log('--切片--')
  console.log(chunks)

  // 传入已经存在的切片清单
  await uploadChunks(uploadedList, chunks, file, hash)
}
