
/* @Author: xuelangcxy
 * @Date:   2016-03-15 22:15:13
 * @Last Modified by:  xuelangcxy
 * @Last Modified time: 2016-03-15 22:15:13
 * @this is change
 */

import http from 'http';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import logger from './logger';

import { baseUrl, rootPath } from './config.js';

let picArr = [];
let urlList = [];

const checkFolderExist = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdir(path, (err) => {
      if (err) {
        throw err;
      }
    });
  }
};

const download = (url, cb) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      cb(data);
    });
  }).on('error', (err) => {
    console.log('error during download: ', err);
    cb(null);
  });
};

/*
 * @desc 根据图片列表去获取图片并存放在对应目录下
 * @author xuelangcxy
 * @param {Callback} callback
 */
const storeImgToLocal = (picArr, title) => {
  let num = 0;
  picArr.forEach((elem, i) => {
    const { name, url } = elem;
    //const picFullPath = path.join('./girls', title, name);
		const picFullPath = './girls/' + title + '/' + name;
    if (!fs.existsSync(picFullPath)) {
      console.log(i + ':' + url);
      http.get(url, (res) => {
        let imgData = '';
        res.setEncoding('binary');
        res.on('data', (chunk) => {
          imgData += chunk;
        });
        res.on('end', () => {
          fs.writeFile(picFullPath, imgData, 'binary', (err) => {
            if (err) {
              throw err;
            }
            console.log('\x1b[33m%s\x1b[0m: ', ++num + ':Download ' + name + ' success!');
          })
        })
      }).on('error', (err) => {
        console.error('error during storeImgToLocal: ', err);
      })
    }
  })
};

/*
 * @desc 获取每个主题下的图片src列表
 * @author xuelangcxy
 * @param {Callback} callback
 */
const getImgUrl = (urlList, cb) => {
  urlList.forEach((element, index) => {
    const { url, title } = element;
    picArr[index] = [];

    const path = rootPath + title + '/';
    checkFolderExist(path);
    download(url, (data) => {
      if (data) {
        const $ = cheerio.load(data);
        $('.entry-content img').each((i, e) => {
          const picUrl = $(e).attr('src');
          const picName = picUrl.slice(picUrl.lastIndexOf('/') + 1);
          const picTitle = $(e).attr('alt');
          picArr[index].push({
            url: picUrl,
            name: picName,
            title: picTitle,
          });
        })
        storeImgToLocal(picArr[index], title);
      } else {
        console.error('getImgUrl failed!');
      }
    })
  })
};

/*
 * @desc 获取主页上所有主题的url列表
 * @author xuelangcxy
 * @param {Callback} callback
 */
const getUrlList = (cb) => {
  download(baseUrl, (data) => {
    if (data) {
      const $ = cheerio.load(data);
      $("#tagcloud-cc a").each((i, e) => {
        const listUrl = $(e).attr('href');
        const urlTitle = $(e).text();
        urlList.push({
          url: listUrl,
          title: urlTitle,
        });
      })
      cb(urlList);
    } else {
      console.error('Download interupted!');
    }
  })
}

getUrlList((urlList) => {
  checkFolderExist(rootPath);
  getImgUrl(urlList, () => {
    console.log('Done getting url list!');
  });
})

