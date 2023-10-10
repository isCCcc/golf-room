function getDate(extra) {
  var dat = new Date(); //生成日期
  var year = dat.getFullYear(); //取得年
  var month = (dat.getMonth() + 1).toString().padStart(2,'0');; //取得月,js从0开始取,所以+1
  var date1 = dat.getDate().toString().padStart(2,'0'); //取得天
  var hour = dat.getHours().toString().padStart(2,'0'); //取得小时
  var minutes = dat.getMinutes().toString().padStart(2,'0'); //取得分钟
  var second = dat.getSeconds().toString().padStart(2,'0'); //取得秒
  var milisecond = dat.getMilliseconds().toString().padStart(3,'0');
  dat = undefined;
  return (
    '[' +
    // year + "-" + month + "-" + date1 + " " +
    hour + ":" + minutes + ":" + second + ":" + milisecond +
    (extra ? " " + extra : "") +
    ']'
  );
}

const bindedGetDate = function () {
  return getDate.apply(this)
}


console.old_log = console.log;
console.log = function() {
  // process.stdout.write(getDate("-log-: "));
  var err = new Error();
  var stack = "Error\n"
  stack += err.stack.split("\n")[2]
  err.stack = stack;
  // err.stack = "Errors\nat %cObject.log (http://127.0.0.1:28305/appservice/common/vendor.js:3545:13)"; 

  // var traceobj = new Error("").stack.split("\n")[2].split(":");
	// var file = traceobj[0].split(process.env.PWD + '/')[1];
  // var line = traceobj[1];
  // var new_args = [file + ":" + line + " >>"];

  console.old_log.apply(console.log, [getDate(""), ...arguments]);
}

console.old_info = console.info.bind(console);
console.info = function() {
  console.old_info.apply(console.info, [getDate(""), ...arguments]);
}

console.old_debug = console.debug.bind(console);
console.debug = function() {
  console.old_debug.apply(console.debug, [getDate(""), ...arguments]);
}

console.old_warn = console.warn.bind(console);
console.warn = function() {
  console.old_warn.apply(console.warn, [getDate(""), ...arguments]);
}

console.old_error = console.error.bind(console);
console.error = function() {
  console.old_error.apply(console.error, [getDate(""), ...arguments]);
}

if (console.trace) {
  console.old_trace = console.trace.bind(console);
  console.trace = function() {
    console.old_trace.apply(console.trace, [getDate(""), ...arguments]);
  }
}


// console.log = console.log.bind(console, bindedGetDate());
// console.trace = console.trace.bind(console, getDate(""));
// console.info = console.info.bind(console, getDate(""));
// console.debug = console.debug.bind(console, getDate(""));
// console.warn = console.warn.bind(console, getDate(""));
// console.error = console.error.bind(console, getDate(""));

global.log = console.log;
// global.debug = console.debug;
// global.trace = console.trace;
// global.info = console.info;
// global.warn = console.warn;
// global.error = console.error;


module.exports = global;
