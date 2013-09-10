/**
 * Created with JetBrains WebStorm.
 * User: BornyTM
 * Date: 6/30/13
 * Time: 1:12 PM
 * To change this template use File | Settings | File Templates.
 */
var request = require("request"),
    fs = require("fs"),
    neo4j = require('neo4j'),
    db = new neo4j.GraphDatabase('http://localhost:7474');


exports.term = function (req, res) {
    var query = ('MATCH n:Initial RETURN n.name AS name, labels(n) AS tags');
    db.query(query, function (err, results) {
        if (err) {throw err};
        res.send(results);
    });
};

exports.getContent = function (req, res) {
    var query = req.query.query;

        //ask tuna about security issues....
        //would checking for key terms be enough security? (remove, create, set, etc) can you modify content with match alone?



    console.log(query);
    console.log("getContent here");


//    db.query(query, function (err, results) {
//        if (err) {throw err};
//        res.send(results);
//    });
}


exports.createContent = function (req, res) {

    var content = JSON.parse(req.query.content);
    var query = ("CREATE (n:Content {Title: {title}, URL: {url}, Description: {description}, Source: {source}, Links: {links}, Value: {valueStatement} })");

    query = query.replace("{title}", "\"" + content.title + "\"");
    query = query.replace("{url}", "\"" + content.url + "\"");
    query = query.replace("{description}", "\"" + content.description + "\"");
    query = query.replace("{source}", "\"" + content.source + "\"");
    query = query.replace("{links}", "\"" + content.links + "\"");
    query = query.replace("{valueStatement}", "\"" + content.valueStatement + "\"");

   db.query(query, function (err, results) {
       if (err) {res.send()};
       res.send();
   });
}
exports.addImage = function (req,res) {
    var url = req.query.url;
    var fileName = req.query.fileName;

    console.log(req.query);
    request(url).pipe(fs.createWriteStream("./img/submittedContent/" + fileName));

    //what is res.send doing here...is there a better way of sending confirmation?
    res.send();
}
exports.fileupload = function (req,res){
    var image = req.files;
    var fileName = req.query.fileName;
    var path = req.files.uploadedFile.path;

    console.log(image);
    console.log(fileName);
    console.log(path);


    fs.readFile(req.files.uploadedFile.path, function (err, data) {

        fs.writeFile("./img/submittedContent/" + fileName, data, function (err) {
            res.send();
        });
    });


}