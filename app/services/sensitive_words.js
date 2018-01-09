/**
 * 敏感词检测
 * */
const nodejieba = require('nodejieba');
const fs = require('fs');
const path = require('path');

const readLine = require('readline');

let sensitiveWords = [];

/**
 * 检测敏感词
 * */
function checkSensitiveWord(word) {
    if (sensitiveWords.length === 0) {
        // 读取整个文件
        let bufferStr = fs.readFileSync(path.join(__dirname, './sensitive_words.txt'));
        // 按照换行符分隔敏感词
        sensitiveWords = bufferStr.toString().split('\n');
    }
    let cutWords = nodejieba.cut(trim(word));
    let result = false;

    for (let i = 0; i < cutWords.length; i++) {
        let word = cutWords[i];
        for (let j = 0; j < sensitiveWords.length; j++) {
            let sensitiveWord = sensitiveWords[j];
            if (sensitiveWord === word) {
                return true;
            }
        }
    }
    return result;
}

/**
 * 去掉空格
 * */
function trim(str) {
    return str.replace(/\s/g, '');
}

let sensitiveWordService = {
    checkSensitiveWord: checkSensitiveWord,
};
module.exports = sensitiveWordService;