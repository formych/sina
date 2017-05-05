const http = require('http'),
	url = require('url'),
	querystring = require('querystring'),
	fs = require('fs'),
	readline = require('readline');

var inputFile = __dirname + '/comments-urls/',
	outputFile = __dirname + '/comments/',
	urls = [],
	now = new Date();
console.log('Start time(getComments): ' + now.toLocaleString());

if (fs.access(inputFile, (err) => {
	if (err) {
		console.log('file ' + inputFile + ' can\'t access or not exists!');
		process.exit()
	}
}));
if (fs.access(outputFile, (err) => {
	if (err) {
		console.log('file ' + outputFile + ' can\'t access or not exists!');
		process.exit()
	}
}));

if (process.argv[2]) {
  inputFile += process.argv[2];
  outputFile += process.argv[2].split('.')[0];
} else {
  inputFile += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '.txt';
  outputFile += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
}
fs.mkdirSync(outputFile);

try {
	getAll();
} catch (e) {

} finally {

}

function getAll() {
	var rl = readline.createInterface({
	    input: fs.createReadStream(inputFile)
	});
	rl.on('line', (line) => {
	    urls.push(line)
	})
	.on('close', function(err) {
	    for (let i in urls) {
	        let commentUrl = urls[i];
	        setTimeout(() => {
	        	//console.log(i);
	            getCommentAmount(commentUrl, i);
	        }, i * 3000);
	    }
	});
}
function getCommentAmount (commentUrl, i) {
	http.get(commentUrl, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		})
		res.on('end', () => {
			console.log(commentUrl);
			let result = JSON.parse(data),				
				commentsArr = result.result.cmntlist,
				times,
				head,
				comments = '',
				outputFileName = outputFile + '/' +i + '.txt';

				if (result.result.status.code !== 0) {
					console.log(commentUrl);
					return false;
				}

				if (result.result.count.show !== null) {
					commentsAmount = result.result.count.show;
				} else {
					commentsAmount = '未知';
				}
				head = '原文链接：' + result.result.news.url + '\n新闻标题：' + '\n总计：' + commentsAmount +'\n';				
				times = Math.ceil(commentsAmount / 100);

			for (index in result.result.cmntlist) {
        		comments += "评论: " + (parseInt(index) + 1) + "\n\t" + commentsArr[index].content + "\n";
        	}
        	fs.writeFile(outputFileName, (head + comments), {flag: 'a'}, () => {

			})

			for (let i = 1; i < times; i++) {
				let comment_url = url.parse(commentUrl, true);
				comment_url.query.page++;
				comment_url.query.jsvar = randomStr();
				comment_url.search = querystring.stringify(comment_url.query);
				let tmp = commentUrl = url.format(comment_url);

    			setTimeout(() => {
    				getCommentsData(tmp, outputFileName, i);
    			}, i * 2500);
			}
    });
		res.on('error', (err) => {
			fs.writeFile('./error.log', err, {flag: 'a'}, () => {
				console.log(err)
			})
		})
	})
}

function getCommentsData (commentUrl, outputFileName, i) {
	http.get(commentUrl, (res) => {
		let data = '';
		res.on('data', (chunk) => {
			data += chunk;
		})
		res.on('end', () => {
			let result = JSON.parse(data),
				comments = '';
			if (result.result.status.code !== 0) {
				console.log(commentUrl);
				return false;
			}
			if (result.result.cmntlist) {
				result.result.cmntlist.forEach((comment, index) => {
				comments += "评论: " + (i * 100 + index + 1) + "\n\t" + comment.content + "\n"
				});
				fs.writeFile(outputFileName, comments, {flag: 'a'}, () => {
				})
			}			
		})
		res.on('error', (err) => {
			fs.writeFile('./error.log', err, {flag: 'a'}, () => {
				console.log(err)
			})
		})
	})
}

function randomStr(len) {
	let str = 'requestId_';
	len = len ? len : 6;
	for (let i = 0; i < len; i++)
		str += Math.floor(Math.random() * 10);
	return str;
}
process.on('exit',	() => {
	console.log('End time(getComments): ' + new Date().toLocaleString() + '\n');
})
