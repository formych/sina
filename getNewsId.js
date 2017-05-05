const http = require('http'),
	url = require('url'),
	querystring = require('querystring'),
	fs = require('fs'),
	cheerio = require('cheerio'),
	readline = require('readline');

var inputFile = __dirname + '/news/',
	outputFile = __dirname + '/comments-urls/',
	newsUrls = [],
	now = new Date();

console.log('Start time(getNewsId): ' + now.toLocaleString());

if (fs.access(inputFile, (err) => {
	if (err) {
		console.log('file ' + inputFile + ' can\'t access or not exists!')
		process.exit()
	}
}));

if (fs.access(outputFile, (err) => {
	if (err) {
		console.log('file ' + outputFile + ' can\'t access or not exists!');
		process.exit();
	}
}));

if (process.argv[2]) {
  inputFile += process.argv[2];
  outputFile += process.argv[2];
} else {
  inputFile += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '.txt';
  outputFile += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '.txt';
}


//read urls in inputFile, push array
var $ = null,
 	query = {
		format: 'json',
		channel: '',
		newsid: '',
		group: 0,
		compress: 1,
		ie: 'gbk',
		oe: 'gbk',
		page: 1,
		page_size: 100,
		jsvar: ''
	},
	commentUrl = {
		protocol: 'http',
		host: 'comment5.news.sina.com.cn',
		pathname: 'page/info',
		search: ''
	};

var rl = readline.createInterface({
    input: fs.createReadStream(inputFile)
});
rl.on('line', (line) => {
    newsUrls.push(line)
})
.on('close', function(err) {
    for (let i in newsUrls) {
        let url = newsUrls[i];
        setTimeout(() => {
        	getNewsId(url, i);
        }, i * 3000);
    }
})


function getNewsId(newsUrl, i) {
    try {
			http.get(newsUrl, (res) => {
	        let data = '';
	        res.on('data', (chunk) => {
	            data += chunk;
	        });
	        res.on("end", () => {
			    	$ = cheerio.load(data);
						console.log(newsUrl);
            if ($('html head meta[name="comment"]').attr('content') == null) {
              console.log('This url is invalid');
              return false;
            }
            let comment = $('html head meta[name="comment"]').attr('content').split(':');
			    	let channel = comment[0],
			    		newsid = comment[1];

			    	query.channel = channel
			    	query.newsid = newsid
			    	query.jsvar = randomStr()

			    	commentUrl.search = querystring.stringify(query);
			    	fs.writeFile(outputFile, (url.format(commentUrl) + '\n'), {flag: 'a'}, () => {
			    	})
	    		});
	     		res.on("error", () => {
	        	console.log('GET error');
	        });
	    });

    } catch (e) {
    } finally {
    }
}

function randomStr(len) {
	let str = 'requestId_';
	len = len ? len : 6;
	for (let i = 0; i < len; i++)
		str += Math.floor(Math.random() * 10);
	return str;
}+
process.on('exit',	() => {
	console.log('End time(getNewsId): ' + new Date().toLocaleString() + '\n');
})
