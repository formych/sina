const http = require('http'),
	fs = require('fs'),
	cheerio = require('cheerio');
var now =new Date(),
	outputFile = __dirname + '/news/',
	modules,
  options = {
    hostname: '',
    port: 80,
    path: '',
    method: 'POST',
    headers: {
        "Connection": "keep-alive",
        "Content-Length": 111,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
    }
  };
console.log('Start time(getNews): ' + now.toLocaleString());

if (fs.access(outputFile, (err) => {
	if (err) {
		console.log('file ' + inputFile + ' can\'t access or not exists!')
		process.exit();
	}
}));
outputFile += now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '.txt';
modules = fs.readFileSync(__dirname + '/config/news.json', 'utf8');
modules = JSON.parse(modules);

modules.forEach((value, key) => {
	setTimeout(() => {
		getNewsUrl(value, key);
	},
	key * 60000);
});
function getNewsUrl(module, key) {
	let newsSet = new Set(),
		newsUrlString = '';
  try {
		http.get(module.url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on("end", () => {
		    	let $ = cheerio.load(data),
						$news = $(module.elements);
					$news.each((key, value) => {
						newsSet.add(value.attribs.href);
					});
					newsSet.delete('http://sifa.sina.com.cn/');
					newsSet.forEach((value) => {
						if (value.indexOf('video') == -1)
							newsUrlString += value + '\n';
					});
					console.log('\t' + key + ': ' + module.url);
          console.log('\tSize: ' + newsSet.size);
	    		fs.writeFile(outputFile, newsUrlString, {flag: 'a'}, () => {
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
process.on('exit',	() => {
	console.log('End time(getNews): ' + new Date().toLocaleString() + '\n');
})
