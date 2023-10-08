const fs = require('fs');
const path = require('path');

const process = (rafDir, jpgDir, suffix = 'RAF') => {
    if (!fs.existsSync(rafDir)) {
        console.log('没有找到路径：', rafDir);
    }
    
    const fileList = fs.readdirSync(rafDir);
    if (!fs.existsSync(jpgDir)) {
        fs.mkdirSync(jpgDir);
    }

    console.log('RAW文件路径：', rafDir);
    console.log('输出jpg路径：', jpgDir);
    console.log('文件列表：', fileList);

    let id = 0;

    fileList.forEach(fileName => {
        const filePath = path.resolve(rafDir, fileName);
        if (filePath.endsWith(`.${suffix}`)) {
            console.log('处理中：', filePath);
            const fileContent = fs.readFileSync(filePath);
            const jpegDataOffset = parseInt(fileContent.toString('hex', 84, 88), 16);
            const jpegDataLength = parseInt(fileContent.toString('hex', 88, 92), 16);
            const jpegContent = Buffer.alloc(jpegDataLength);
            fileContent.copy(jpegContent, 0, jpegDataOffset, jpegDataOffset + jpegDataLength);
            const jpegFilePath = path.resolve(jpgDir, `${id}.jpg`);
            fs.writeFileSync(jpegFilePath, jpegContent);
            fs.renameSync(filePath, path.resolve(rafDir, `${id}.RAF`));
            id++;
        } else {
            console.log('识别到一个不知道该怎么处理的项目：', filePath);
        }
    });
};

process(
    path.resolve(__dirname, 'test'),
    path.resolve(__dirname, 'test/jpg'),
);
