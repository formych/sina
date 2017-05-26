v1:(已不使用)
	用法:
		node sina-v1.js one.txt one
		node sina-v1.js all.txt all
		参数：输入文件（url列表)
			  输出文件
	单一的url:
		功能完全正常
	多个url:
		总体已经实现评论的获取和存储，由于异步的原因，每一个setTimeout的间隔都是2s，导致双重异步，会导致网站限制访问报错，不健壮
		bugs:
			评论文件的缺少和重复
		原因:
			嵌套的setTimeout和回调

v2:(理论上可行,1200条里能稳定获取到1100条左右,已淘汰)
	用法:
		node getNewsId news.txt
		node getComments.js comments.txt 
			comments.txt 为上次得到的评论列表

	实现：
		准备单元化两个功能，保证数据一致性
			1.先获取相关newsid，channel(getNewsId.js)
			2f (err) {
		        console.log(err);
		   		}.读取newsid，channel,发起获取评论(getComments.js),评论分块存储到comments文件下



	
	准备:
		1.先准备好要获得的目标新闻url列表，放入news.txt,删除urls和comments下的所有文件(clean.sh)
		2.执行node getNewsId.js
		3.上述完成后再执行node getComments.js
		4.查看comments下的相关txt即为得到的评论列表
		5.由于访问时间比较长，建议使用nohup node getNewsId.js > log &, nohup node getComments.js ./urls/xxx.txt >> log


v3:
	用法：
		nohup node getNews.js > log
		nohup node getNewsId.js > log.id
		nohup node getComments.js > log.comments
	实现：
		分为三个模块独立实现数据的获取存储，避免一个错误引起程序的停止运行
		
	Note：
		要获取的内容在config下的配置news.json文件p
		news：为搜集的新闻url文件夹（目前大致每次50条(四个模块)）
		comments-url：为上述新闻对应的评论url，执行之前最好去重
		commens：为上面对应的评论文件
	最佳实践：
		由于新闻和评论的更新时间，把这个脚本的执行加入crontab中，定时执行从而达到资源和效率的最大化

		目前getNews的脚本执行时间为每天的10点
		getNewsId的脚本执行时间为每天的21点
		getComments的脚本执行时间为每天的23点

	提取评论数据内容:
                1.进入到comments下面
                2.cat  */*.txt > all.txt
                3.    ../run.sh all.txt
                4.scp all.txt到指定的目录
                5.rm -rf ./* (建议删除，方便每次的处理)


Bug处理：
    由于该脚本存在一些缺陷，会生成僵尸进程
    执行ps -ef | grep node
    查看是否有僵尸进程
        1.node getNews
        2.node getNewsId
    清空日志文件
        echo > log