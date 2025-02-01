const path = require('path')

require.main.filename

module.exports = path.dirname(
    require.main.filename
    // process.mainModule.filename
);