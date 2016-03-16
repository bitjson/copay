var fs    = require('fs');
var plist = require('plist');

var FILEPATH = 'platforms/ios/%APP-SHORT-NAME%/%APP-SHORT-NAME%-Info.plist';

module.exports = function (context) {

    var xml = fs.readFileSync(FILEPATH, 'utf8');
    var obj = plist.parse(xml);

    // Write custom keys.
		obj.UIStatusBarHidden = true;
		obj.UIViewControllerBasedStatusBarAppearance = true;

    xml = plist.build(obj);
    fs.writeFileSync(FILEPATH, xml, { encoding: 'utf8' });

};