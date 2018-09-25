var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var cruncher = require('./lib/cruncher.js')
var flags = require('flags')

// define flags
flags.defineBoolean('normalize', false, 'Normalize the wave ?')
flags.defineBoolean('channel', 0, 'Channel for data?')
flags.defineBoolean('linear', false, 'Linear interpolation?')
flags.defineBoolean('exp', false, 'Exponential interpolation?')
flags.defineString('output', '', 'Output filename')

// check usage
if (process.argv.length < 4) {
  console.log('Usage: crunch [SOUND.WAV] [NOTE|BASE FREQUENCY|auto] [--linear|--exp] [--normalize] [--channel=0] [--output=filename]')
  process.exit(1)
}
// parse flags
flags.parse(process.argv.slice(4))

// log
console.log("Crunching data...")
// crunch
var synthdata = cruncher(process.argv[2], process.argv[3], {
  normalize: flags.get('normalize'),
  channel: flags.get('channel'),
  linear: flags.get('linear'),
  exp: flags.get('exp')
})

// log
var output = flags.get('output')
if (output.length < 1) {
	var filename = path.basename(process.argv[2], path.extname(process.argv[2])) + '.snt'
} else {
	var filename = output
}
console.log("Saving data as " + filename + "...")
// creating buffer
var buf = Buffer.from(_.map(_.chunk(synthdata, 2), function (chunk) {
  return _.reduce(chunk, function(cur, oth) {
    return (cur << 4) + oth
  }, 0)
}))

// save buff
fs.writeFile(path.dirname(process.argv[2]) + "/" + filename, buf, function(err) {
  // error
  if (err) {
    console.log("Error : " + err)
    process.exit(1)
  } else {
    console.log("Successfully output " + filename + "!")
  }
})

// done
console.log('Done!')
