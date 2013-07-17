/**
 * Created with JetBrains WebStorm.
 * User: BornyTM
 * Date: 6/30/13
 * Time: 1:12 PM
 * To change this template use File | Settings | File Templates.
 */

/*var query = [
    'START user=node({userId})',
    'MATCH (user) -[:likes]-> (other)',
    'RETURN other'
].join('\n');

var params = {
    userId: currentUser.id
};

db.query(query, params, function (err, results) {
    if (err) throw err;
    var likes = results.map(function (result) {
        return result['other'];
    });
    // ...
});
*/
/*
User.prototype._getFollowingRel = function (other, callback) {
    var query = [
        'START user=node({userId}), other=node({otherId})',
        'MATCH (user) -[rel?:FOLLOWS_REL]-> (other)',
        'RETURN rel'
    ].join('\n')
        .replace('FOLLOWS_REL', FOLLOWS_REL);

    var params = {
        userId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var rel = results[0] && results[0]['rel'];
        callback(null, rel);
    });
};
 */
neo4j = require('neo4j');
db = new neo4j.GraphDatabase('http://localhost:7474');


exports.test = function (req, res) {
    var query = [
        'MATCH n',
        'RETURN n.name AS name, labels(n) AS labels'
    ].join("\n");          //.replace when injecting params? see below
    db.query(query, function (err, results) {
        if (err) {throw err};
            res.send(results);
        });
};

exports.type = function (req, res) {
    var query = [
        'MATCH n:Type',
        'RETURN n.name AS name, labels(n) AS tags'
    ].join("\n");
    db.query(query, function (err, results) {
        if (err) {throw err};
        res.send(results);
    });
};
/*
 ?name=tobi
 req.param('name')
 => "tobi"
 */

//for (x in req.param('terms')) {

//for (x in req/param('type')) {

//var str="Visit Microsoft!";
//var n=str.replace("Microsoft","W3Schools");

//loop up how join works for term loop?

//build match string, where string, and return string.

/*
Take a look at this code:
    view sourceprint?

    "START n=node(*) WHERE n='"+search+"' RETURN n"

if "search" comes from an interactive user then you can imagine what kind of injections are possible. The correct way is to use cypher parameters which any driver should expose an api for. If you use the awesome node-neo4j api by aseemk you could do it like this:
view sourceprint?

    qry = "START n=node(*) WHERE n={search} RETURN n"
    db.query qry, {search: "async"}*/
