const fs = require('fs');
const path = require('path');

let info = {};

const rafFilePath = path.join(__dirname, './test/1.RAF');
const jpegFilePath = path.join(__dirname, './test/jpg/0.jpg');
// const tiffFilePath = path.join(__dirname, 'test.tiff');

// const hex = (buffer, start, end) => buffer.toString('hex', start, end);
// const get2 = (buffer, i = 0) => [buffer.readInt16BE(i + 0), buffer.readInt16BE(i + 2)];
// const get4 = (buffer, i = 0) => [
//     buffer.readInt16BE(i + 0),
//     buffer.readInt16BE(i + 2),
//     buffer.readInt16BE(i + 4),
//     buffer.readInt16BE(i + 6)
// ];

// const sget2 = buffer => [buffer.readInt16BE(0), buffer.readInt16BE(2)];

// const fileStat = fs.lstatSync(rafFilePath);

// const UNSHORT = (buf) => buf.readInt16BE();
// const ASCII = buf => buf.toString('ascii');

// const tagIdMap = {
//     '0100': UNSHORT,
//     '0110': ASCII,
//     '0111': UNSHORT,
//     '0112': UNSHORT,
//     '0113': UNSHORT,
//     '0115': UNSHORT,
//     '0117': UNSHORT,
//     '0118': UNSHORT,
//     '0119': UNSHORT,
//     '0130': UNSHORT,
//     '0131': ASCII
// }

// console.log(fileStat);
// const fileContent = Buffer.alloc(fileStat.size);

const fileContent = fs.readFileSync(rafFilePath);

const identify = fileContent.toString('utf-8', 0, 16); // 16
const formatVersion = fileContent.toString('utf-8', 16, 20); // 4
const cameraId = fileContent.toString('utf-8', 20, 28); // 8
const cameraType = fileContent.toString('utf-8', 28, 60); // 32
const dirVersion = fileContent.toString('utf-8', 60, 64);

// console.log([identify, formatVersion, cameraId, cameraType, dirVersion].join('\n'));
info = {...info, identify, formatVersion, cameraId, cameraType, dirVersion};

const jpegDataOffset = parseInt(fileContent.toString('hex', 84, 88), 16);
const jpegDataLength = parseInt(fileContent.toString('hex', 88, 92), 16);

// console.log(jpegDataOffset, jpegDataLength);

const cfaHeaderOffset = parseInt(fileContent.toString('hex', 92, 96), 16);
const cfaHeaderLength = parseInt(fileContent.toString('hex', 96, 100), 16);

const cfaOffset = parseInt(fileContent.toString('hex', 100, 104), 16);
const cfaLength = parseInt(fileContent.toString('hex', 104, 108), 16);

// console.log([jpegDataOffset, jpegDataLength, cfaHeaderOffset, cfaHeaderLength, cfaOffset, cfaLength].join('\n'));

info = {...info, jpegDataOffset, jpegDataLength, cfaHeaderOffset, cfaHeaderLength, cfaOffset, cfaLength}

// const jpegContent = Buffer.alloc(jpegDataLength);

// fileContent.copy(jpegContent, 0, jpegDataOffset, jpegDataOffset + jpegDataLength);

// fs.writeFileSync(jpegFilePath, jpegContent);


const cfaHeader = Buffer.alloc(cfaHeaderLength);
fileContent.copy(cfaHeader, 0, cfaHeaderOffset, cfaHeaderOffset + cfaHeaderLength);
const cfaHeaderRecordsCount = parseInt(cfaHeader.toString('hex', 0, 4), 16);
console.log(cfaHeaderRecordsCount);
let index = 0;
let current = 4;
const records = [];
while (index < cfaHeaderRecordsCount) {
    const tagId = cfaHeader.toString('hex', current, current += 2);
    const recordSize = parseInt(cfaHeader.toString('hex', current, current += 2), 16);
    const recordData = Buffer.alloc(recordSize);
    cfaHeader.copy(recordData, 0, current, current += recordSize);
    console.log(index, tagId, recordSize);
    // console.log('data: ', tagId, tagIdMap[tagId] && tagIdMap[tagId](recordData));
    // console.log(recordData.toString('hex'));
    records.push({tagId, recordSize, recordData});
    index++;
}
console.log(cfaHeader.toString('hex', 0, 4));

console.log(records, current, cfaOffset);

// height width
// console.log(get2(records[0].recordData));

// // ctop cleft
// console.log(get2(records[1].recordData));

// // cheight cwidth
// console.log(get2(records[2].recordData));

// // RawImageAspectRatio 比例

// console.log(get2(records[5].recordData));
// // fuji layout
console.log((records[0].recordData.toString('hex', 0, 2)), (records[0].recordData.toString('hex', 2, 4)));
// // xtranslayout 6 * 6
// console.log((records[10].recordData.toString('hex')));

// // RawExposureBias
// console.log(get2(records[12].recordData));

// // imFuji.RAFDataGeneration = 4;
// // offsetWH_inRAFData = 8;
// // RAFDataVersion 25858
// console.log(get2(records[14].recordData), (records[14].recordData.toString('hex', 4, 8)));
// console.log(get4(records[14].recordData));
// console.log(' ----- start -----')
// let i = 0;
// while (i < 32) {
//     console.log(get4(records[14].recordData, i * 8))
//     i++;
// }
// console.log(' ----- end ----- ')

// console.log('Jpeg: ', jpegDataOffset, jpegDataOffset + jpegDataLength);
// console.log('CFA Header: ', cfaHeaderOffset, cfaHeaderOffset + cfaHeaderLength);
// console.log('is that? ', current, cfaHeaderLength);

// console.log('CFA DATA: ', cfaOffset);

// const cfaData = Buffer.alloc(cfaLength);

// fileContent.copy(cfaData, 0, cfaOffset, cfaOffset + cfaLength);

// console.log(Number(cfaData.toString('hex', 0, 2)));

// console.log(cfaData.toString('hex', 2, 4));
// console.log(cfaData.toString('hex', 4, 8));
// console.log('tiff header over');
// console.log(cfaData.toString('hex', 8, 10)); // entry counts;
// console.log(hex(cfaData, 10, 12)); // tag type
// console.log(hex(cfaData, 12, 14)); // data format
// console.log(hex(cfaData, 14, 18)); // cmpt number
// console.log(hex(cfaData, 18, 22)); // data offset
// console.log(hex(cfaData, 22, 26));
// console.log(cfaData.readInt16LE(26));

// fs.writeFileSync(tiffFilePath, cfaData);



// ImageWidth 256

// Model 272

// StripOffsets 273

// Orientation 274

// 

for (const key in info) {
    console.log(`${key}:\t`, info[key]);
}
