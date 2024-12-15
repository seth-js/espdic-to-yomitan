const fs = require('fs');
const path = require('path');

const espDicEntries = fs.readFileSync(
    path.join('data', 'base', 'espdic.txt')).toString().split('\n')
    .filter(item => item.includes(' : '))
    .map(item => {
        const [word, definition] = item.split(' : ');
        let pos = 'unknown';
        if (/i$/.test(word)) pos = 'v';
        if (/oj?$/.test(word)) pos = 'n';
        if (/aj?$/.test(word)) pos = 'adj';
        if (/e$/.test(word)) pos = 'adv';
        if (/ /.test(word)) pos = 'phrase';
        return { word, definition, pos };

    });

const lemmaDict = {};

for (const { word, definition, pos } of espDicEntries) {
    lemmaDict[word] ??= {};
    lemmaDict[word][pos] ??= new Set();
    for (const def of definition.split(', ')) {
        lemmaDict[word][pos].add(def);
    }
}

const conjugations = JSON.parse(fs.readFileSync(path.join('data', 'base', 'conjugations.json')));

const formDict = {};

for (const { word, pos } of espDicEntries) {
    if (conjugations[pos]) {
        conjugateWord(word, pos);
    }
}

const lemmaYomi = [];

for (const [word, info] of Object.entries(lemmaDict)) {
    for (const [pos, definitions] of Object.entries(info)) {
        lemmaYomi.push(
            [
                word,
                '',
                pos,
                pos,
                0,
                [
                    {
                        'type': 'structured-content',
                        'content': [
                            {
                                'tag': 'div',
                                'content': [Array.from(definitions).join(', ')]
                            }
                        ]
                    }
                ],
                0,
                ''
            ]
        );
    }
}

const formYomi = [];

for (const [form, info] of Object.entries(formDict)) {
    for (const [, { lemma, inflections }] of Object.entries(info)) {
        formYomi.push(
            [form, "", "non-lemma", "", 0, [
                [lemma, [...inflections]
                ]], 0, ""]
        );
    }
}

const yomiIndex = {
    "format": 3,
    "revision": getDate(),
    "sequenced": true,
    "author": "seth-js",
    "url": "https://github.com/seth-js/espdic-to-yomitan",
    "description": "A Yomitan compatible version of ESPDIC.",
    "attribution": "http://www.denisowski.org/Esperanto/ESPDIC/espdic_readme.html",
    "sourceLanguage": "eo",
    "targetLanguage": "en",
    "title": "espdic-eo-en"
};

const yomiTags = [
    ["n", "partOfSpeech", -1, "noun", 1],
    ["adv", "partOfSpeech", -1, "adverb", 1],
    ["adj", "partOfSpeech", -1, "adjective", 1],
    ["v", "partOfSpeech", -1, "verb", 1],
    ["phrase", "partOfSpeech", -1, "phrase", 1],
];

if (!fs.existsSync(path.join('data', 'dictionary'))) {
    fs.mkdirSync(path.join(path.join('data', 'dictionary')))
}

const batchSize = 10000;
let bankIndex = 0;

const allYomi = [...lemmaYomi, ...formYomi];

while (allYomi.length > 0) {
    const batch = allYomi.splice(0, batchSize);
    bankIndex += 1;
    fs.writeFileSync(path.join('data', 'dictionary', `term_bank_${bankIndex}.json`), JSON.stringify(batch));
}

[
    [yomiTags, 'tag_bank_1.json'],
    [yomiIndex, 'index.json']
].forEach(([file, fileName]) => {
    fs.writeFileSync(path.join('data', 'dictionary', fileName), JSON.stringify(file));
})

console.log('Words in dictionary:', Object.keys(lemmaDict).length);
console.log('Wrote dictionary files to the `data/dictionary` directory. Please zip them, then import in Yomitan.');

function conjugateWord(word, pos) {
    const conjugationEnries = conjugations[pos];
    for (const [replaced, replacement, inflections] of conjugationEnries) {
        if (new RegExp(`${replaced}$`).test(word)) {
            formDict[word.replace(new RegExp(String.raw`${replaced}$`, ''), replacement)] ??= {};
            formDict[word.replace(new RegExp(String.raw`${replaced}$`, ''), replacement)][pos] = { lemma: word, inflections };
        }
    }
}

function getDate() {
    return new Intl.DateTimeFormat('en-CA').format(new Date()).replace(/-/g, '.');
}
