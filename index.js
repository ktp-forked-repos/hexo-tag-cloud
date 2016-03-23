'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Hexo = require('hexo');

hexo.on('exit', function(post) {
    fs.listDir(pathFn.join(hexo.public_dir, 'tags')).then(function(files) {
        console.log("generating tagcloud.xml");
        var tags = {}
        for (var idx in files) {
            if (!(Object.prototype.toString.call(files[idx]) === "[object String]")) {
                continue;
            }

            if (files[idx].indexOf('/') < 1) {
                continue;
            }

            var tagName = files[idx].substr(0, files[idx].indexOf('/'));
            if (tags[tagName]) {
                tags[tagName] = tags[tagName] + 1;
            } else {
                tags[tagName] = 1;
            }
        }
        var content = '<tags>';
        for(var tag in tags){
            if(tags.hasOwnProperty(tag)) {
                var fontSize = (tags[tag] > 10 ? 20 : tags[tag] + 8) + parseInt(Math.random() * 10);
                content += '<a href="'+hexo.config.url+'/tags/'+tag+'" class="tag-link-'+tag+'" title="'+tags[tag]+' topics" rel="tag" style="font-size:'+fontSize+'pt;">'+tag+'</a>';
            }
        }
        content += '</tags>';
        fs.writeFile(pathFn.join(hexo.public_dir, 'tagcloud.xml'), content);
        console.log("generating tagcloud.xml is ok");

        var cloudPath = pathFn.join(pathFn.join(pathFn.join(hexo.base_dir, 'node_modules'), 'hexo-tag-cloud'), 'tagcloud.swf');
        fs.exists(pathFn.join(hexo.public_dir, 'tagcloud.swf')).then(function (res) {
            if (!res) {
                fs.readFile(cloudPath).then(function(content) {
                    console.log("copying tagcloud.swf");
                    fs.copyFile(cloudPath, pathFn.join(hexo.public_dir, 'tagcloud.swf'));
                    console.log("copying tagcloud.swf is ok");
                });
            }
        })
    });
});