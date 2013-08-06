/**
 * Created with JetBrains WebStorm.
 * User: BornyTM
 * Date: 6/30/13
 * Time: 1:12 PM
 * To change this template use File | Settings | File Templates.
 */


neo4j = require('neo4j');
db = new neo4j.GraphDatabase('http://localhost:7474');


exports.term = function (req, res) {
    var query = ('MATCH n:Initial RETURN n.name AS name, labels(n) AS tags');
    db.query(query, function (err, results) {
        if (err) {throw err};
        res.send(results);
    });
};

exports.definition = function (req, res) {
    req.query
    //get definitions for specific term
}


exports.getContent = function (req, res) {
    var query = req.query.query;

        //ask tuna about security issues....
        //would checking for key terms be enough security? (remove, create, set, etc) can you modify content with match alone?



//    var includedTypes = req.query.includeTypes;
//    var excludedTypes = req.query.excludeTypes;
//    var includedTerms = req.query.includeTerms;
//    var excludedTerms = req.query.excludeTerms;


//    MATCH username:user-[z]-a:content ((only show terms user has not ‘blocked’ from appearing)), term1:term1-[:related_to]-a:content, term2:term2-[:related_to] a:content, term3:term3-[:related_to]-a:content, term4:term4-[:related_to]-a:content ((terms that must be connected)), type1:type1-[is_a]-a, type2:type2-[is_a]-a, ((types that must be connected))
//    WHERE username.userID=“THE USERS-ID” AND type(z)<>BLOCKED AND term1.name=‘term1’ AND term2.name=‘term2’ AND term3.name=’term3’, term4.name =‘term4’, type1.name=’type1’, type2.name=‘type2’
//    RETURN a

    console.log(query);
    console.log("getContent here")


//    db.query(query, function (err, results) {
//        if (err) {throw err};
//        res.send(results);
//    });
}




/*
 ?name=tobi
 req.param('name')
 => "tobi"
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
