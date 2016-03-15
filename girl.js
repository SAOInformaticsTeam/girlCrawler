/* @Author: xuelangcxy
 * @Date:   2016-03-15 22:15:13
 * @Last Modified by:   xuelangcxy
 * @Last Modified time: 2016-03-15 22:15:13
 */

'use strict';

var http = require("http"),
	cheerio = require("cheerio"),
	fs = require('fs');

var baseUrl = "http://www.girl13.com",
	picArr = [],
	urlList = [],
	rootPath = './girls/';

/*
 * @desc 获取主页上所有主题的url列表
 * @author xuelangcxy
 * @param {Callback} callback
 */

function getUrlList(callback) {
	download(baseUrl, function(data) {
		if (data) {
			var $ = cheerio.load(data);

			$("#tagcloud-cc a").each(function(i, e) {
				var listUrl = $(e).attr("href");
				var urlTitle = $(e).text();
				urlList.push({
					url: listUrl,
					title: urlTitle
				})
			})
			callback(urlList);
			console.log("Done getting url list!");
		} else console.log("error");
	});
}

getUrlList(function(urlList) {
	checkFolderExist(rootPath);
	getImgUrl(urlList, function() {})
})

/*
 * @desc 获取每个主题下的图片src列表
 * @author xuelangcxy
 * @param {Callback} callback
 */
function getImgUrl(urlList, callback) {
	urlList.forEach(function(element, index) {
		console.log(element.url + " : " + index);
		picArr[index] = [];

		var path = rootPath + element.title + '/';
		checkFolderExist(path);
		download(element.url, function(data) {
			if (data) {
				var $ = cheerio.load(data);

				$(".entry-content img").each(function(i, e) {
					var picUrl = $(e).attr("src");
					var picName = picUrl.slice(picUrl.lastIndexOf("/") + 1, picUrl.length);
					var picTitle = $(e).attr('alt');
					picArr[index].push({
						url: picUrl,
						name: picName,
						title: picTitle
					})
				});
				storeImgToLocal(picArr[index], element.title);
			} else {
				console.log("error");
			}
		})
	});
	//callback(picArr);
}

function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on("end", function() {
			callback(data);
		});
	}).on("error", function() {
		callback(null);
	});
}

/*
 * @desc 根据图片列表去获取图片并存放在对应目录下
 * @author xuelangcxy
 * @param {Callback} callback
 */
function storeImgToLocal(picArr, title) {
	var num = 0;
	picArr.forEach(function(element, i) {
		var picFullPath = './girls/' + title + '/' + element.name;
		if (!fs.existsSync(picFullPath)) {
			console.log(i + ":" + element.url);
			http.get(element.url, function(res) {
				var imgData = "";

				res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开

				res.on('data', function(chunk) {
					imgData += chunk;
				})
				res.on('end', function() {
					fs.writeFile(picFullPath, imgData, "binary", function(err) {
						if (err) {
							throw err;
						}
						console.log(++num + ':Download ' + element.name + ' success!');
					})

				}).on('error', function() {
					console.log('error!');
				})
			})
		} else {
			// do nothing
		}

	});
}

function checkFolderExist(path) {
	if (!fs.existsSync(path)) {
		fs.mkdir(path, function(err) {
			if (err) {
				throw err;
			}
		});
	}
}

exports.download = download,
	storeImgToLocal = storeImgToLocal,
	checkFolderExist = checkFolderExist;