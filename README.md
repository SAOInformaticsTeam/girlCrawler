#[girlCrawler](https://github.com/xuelangcxy/girlCrawler)

###一个针对网站[http://www.girl13.com](http://www.girl13.com)上图片的爬取工具，具有以下功能和特性:

* 爬取到网站上所有主体下的图片列表
* 在本地建立与各主题对应的文件夹
* 将爬取到的图片下载到本地对应主题的文件夹下
* 多次运行工程能够检测图片文件是否已经存在，如存在则不再下载，只下载新的图片，节省流量

###[girlCrawler](https://github.com/xuelangcxy/girlCrawler)主要是建立在以下依赖库之上的：

* [Node.js](http://nodejs.org/) - 应用服务器
* [cheerio](https://www.npmjs.com/package/cheerio) - 为服务器特别定制的，快速、灵活、实施的jQuery核心实现

###安装和启动

1. 安装[Node.js](http://nodejs.org/).
2. 将整个工程clone到本地.

		>git clone https://github.com/xuelangcxy/girlCrawler.git

3. 在工程的根目录下启动主文件

		>node girl.js

###尚存在的问题

1. 运行该工程时存在中途中断下载的情况，可以直接按Ctrl+c以终止运行并尝试再次启动工程.
2. 下载完成后可能存在某些图片不能查看，图片大小为0，可以将此类图片文件删除并尝试再次运行工程.
3. 再次运行工程不会重复下载已存在的文件.

###温馨提示：

由于图片数量较大，经测试大小大概在350-400MB，请下载前酌情考虑