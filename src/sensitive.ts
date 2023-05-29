import * as fs from 'fs';

export class Sensitive {
    filePath: string = 'config/sensitive_words.txt';
    blockWords: string[] = [];

    constructor() {
        const content = fs.readFileSync(this.filePath, 'utf8');
        this.blockWords = content.split("\n");
    }

    public hasSensitiveWord(text: string): boolean {
        if (this.blockWords.length == 0) {
            return false;
        }
        return this.blockWords.some((word) => text.includes(word));
    }
}