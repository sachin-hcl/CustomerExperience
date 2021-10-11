const cds = require('@sap/cds');
cds.on('bootstrap', (app) => {
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
      })
});


/*const cds = require('@sap/cds');
const multer = require('multer');
const ExcelJS = require('exceljs');

var Readable = require('stream').Readable;

function bufferToStream(buffer) {
    var stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

const upload = multer({ storage: multer.memoryStorage() });

// react on bootstrapping events...
cds.on('bootstrap', (app) => {

    app.use("/upload/DigitalAccess", upload.single('file'), (req, res) => {
        var workbook = new ExcelJS.Workbook();
        var stream = bufferToStream(req.file.buffer)
        workbook.xlsx.read(stream).then((workbook) => {
            var dataset = {};
            workbook.eachSheet((sheet,sheetId)=>{
                dataset[sheet.name] = [];
                sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    dataset[sheet.name].push(row.values);
                });
            });
            console.log(dataset);
        });
        res.send("something rcvd");
    });

    app.post("/upload/excel", upload.single('file'), (req, res) => {
        var workbook = new ExcelJS.Workbook();
        var stream = bufferToStream(req.file.buffer)
        workbook.xlsx.read(stream).then((workbook) => {
            var dataset = {};
            workbook.eachSheet((sheet,sheetId)=>{
                dataset[sheet.name] = [];
                sheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    dataset[sheet.name].push(row.values);
                });
            });
            console.log(dataset);
        });
        res.send("something rcvd");
    });

    
})
*/


module.exports = cds.server;