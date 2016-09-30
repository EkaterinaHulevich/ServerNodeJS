var http = require('http'); 
var fs = require('fs'); 
var url = require('url'); 
var path = require('path'); 

var ROOT = __dirname; 
http.createServer(function(req, response) { 
sendFileSafe(url.parse(req.url).pathname, response); 

}).listen(8888); 

function sendFileSafe(filePath, response) {
	filePath = path.normalize(path.join(ROOT, filePath)); 
	fs.stat(filePath, function(err, stats) {
		if(err) {
			response.statusCode = 404;
			response.end("file error");
			return;
		}
		if (!stats.isFile()) {
			var body = '<html>'+
			'<head>'+
      		'<meta charset="utf-8">'+
     		'</head>'+
      		'<body>'+
      		'<form action="/html_folder/t2.html">'+
      		'<button type="submit"> Open html file </button>'+
      		'</form>'+
      		'<a href="/html_folder/t2.html" download> Download html file <br></a>'+
      		'</body>'+
      		'</html>';
      		response.write(body);
      		response.end();
		} else {
			sendFile(filePath, response);
		}
		
	});
} 

function sendFile(filePath, response) {
	var stream = new fs.ReadStream(filePath);
	stream.on('readable', function(){
		var data = stream.read();
		if(data !== null) {
		response.setHeader('Content-Type', 'text/html' + "; charset=utf-8");
		response.write(data.toString());
	}
});
	stream.on('end', function() {
		response.end();
	});
}
