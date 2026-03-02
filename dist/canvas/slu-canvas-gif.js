"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUCanvasGif = void 0;
class SLUCanvasGif {
    constructor() {
        this.canvasTool = document.createElement("canvas");
        this.LAST_DISPOSA_METHOD = null;
        this.CURRENT_FRAME_INDEX = -1;
        this.TRANSPARENCY = null;
        this.gifCache = {};
        this.aniIds = {};
        this.opts = [];
    }
    async loadGIF(opt, ctx) {
        let { url } = opt;
        let cache = this.gifCache[url];
        this.CTX = ctx;
        if (!cache) {
            this.gifCache[url] = { status: 0, data: null, frameList: [] };
            cache = this.gifCache[url];
            try {
                cache.status = 1;
                const data = await this.fetchGIF(url);
                const stream = new Stream(data);
                cache.status = 2;
                this.parseHeader(url, stream);
                this.parseBlock(opt, stream);
            }
            catch (error) {
                console.error('Error loading GIF:', error);
            }
        }
        else {
            if (cache.status === 1) {
                this.opts.push(opt);
                clearTimeout(this.timeId);
                this.timeId = setTimeout(() => {
                    console.log(this.opts);
                    let opts = this.opts;
                    this.opts = [];
                    opts.forEach(e => this.loadGIF(e, this.CTX));
                }, 100);
            }
            else if (cache.status === 2) {
                this.stopGif(opt);
                this.playGif(opt);
            }
        }
    }
    fetchGIF(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            if ('overrideMimeType' in xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    if (data.toString().indexOf('ArrayBuffer') > 0) {
                        resolve(new Uint8Array(data));
                    }
                    else {
                        resolve(data);
                    }
                }
                else {
                    reject(new Error('XHR Error - Response'));
                }
            };
            xhr.onerror = () => {
                reject(new Error('XHR Error'));
            };
            xhr.send();
        });
    }
    parseHeader(url, stream) {
        let STREAM = stream, GIF_INFO = this.gifInfo = Object.create(null), canvas = this.canvasTool;
        GIF_INFO.sig = STREAM.read(3);
        GIF_INFO.ver = STREAM.read(3);
        if (GIF_INFO.sig !== 'GIF')
            throw new Error('Not a GIF file.');
        GIF_INFO.width = STREAM.readUnsigned();
        GIF_INFO.height = STREAM.readUnsigned();
        let bits = this.byteToBitArr(STREAM.readByte());
        GIF_INFO.gctFlag = !!bits.shift();
        GIF_INFO.colorRes = this.bitsToNum(bits.splice(0, 3));
        GIF_INFO.sorted = !!bits.shift();
        GIF_INFO.gctSize = this.bitsToNum(bits.splice(0, 3));
        GIF_INFO.bgColor = STREAM.readByte();
        GIF_INFO.pixelAspectRatio = STREAM.readByte();
        if (GIF_INFO.gctFlag) {
            GIF_INFO.gct = this.parseCT(1 << (GIF_INFO.gctSize + 1), stream);
        }
        canvas.width = GIF_INFO.width;
        canvas.height = GIF_INFO.height;
        canvas.style.width = GIF_INFO.width + 'px';
        canvas.style.height = GIF_INFO.height + 'px';
        canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
    }
    ;
    parseBlock(opt, stream) {
        let block = Object.create(null), STREAM = stream;
        block.sentinel = STREAM.readByte();
        switch (String.fromCharCode(block.sentinel)) {
            case '!':
                block.type = 'ext';
                this.parseExt(block, stream, opt.url);
                break;
            case ',':
                block.type = 'img';
                this.parseImg(block, stream, opt.url);
                break;
            case ';':
                block.type = 'eof';
                this.playGif(opt);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16));
        }
        if (block.type !== 'eof') {
            this.parseBlock(opt, stream);
        }
    }
    ;
    playGif(opt, index = 0) {
        const that = this, { delay = 0 } = opt;
        const { frameList: list } = that.gifCache[opt.url], len = list.length;
        let lastTimestamp;
        const animate = (timestamp) => {
            if (lastTimestamp === undefined)
                lastTimestamp = timestamp;
            const elapsed = timestamp - (lastTimestamp || timestamp);
            if (elapsed >= delay) {
                lastTimestamp = timestamp;
                index++;
                if (index >= len) {
                    index = 0;
                }
            }
            ;
            that.drawFrame(opt, index);
            that.aniIds[opt.id] = requestAnimationFrame(animate);
        };
        that.aniIds[opt.id] = requestAnimationFrame(animate);
    }
    drawFrame(opt, index) {
        const that = this, ctx = that.CTX;
        let { point, points = [], size = [100, 100], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1, delay } = opt;
        let { frameList: list } = that.gifCache[opt.url];
        that.canvasTool.getContext("2d").putImageData(list[index].data, 0, 0);
        let imgEle = that.canvasTool;
        let sizeX = size[0], sizeY = size[1], sizeOX = sizeo && sizeo[0], sizeOY = sizeo && sizeo[1];
        if (point)
            points = [...points, point];
        for (let i = 0; i < points.length; i++) {
            const e = points[i], x = e[0], y = e[1];
            rotate = (rotate * Math.PI) / 180;
            ctx.globalAlpha = alpha;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(rotate);
            if (sizeOX && sizeOY) {
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            else {
                ctx.drawImage(imgEle, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            ctx.rotate(-rotate);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    stopGif(opt) {
        const that = this, aniId = that.aniIds[opt.id];
        if (!aniId)
            return;
        cancelAnimationFrame(aniId);
        that.aniIds[opt.id] = null;
    }
    parseExt(block, stream, url) {
        let STREAM = stream;
        let parseGCExt = (block) => {
            STREAM.readByte();
            var bits = this.byteToBitArr(STREAM.readByte());
            block.reserved = bits.splice(0, 3);
            block.disposalMethod = this.bitsToNum(bits.splice(0, 3));
            this.LAST_DISPOSA_METHOD = block.disposalMethod;
            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = STREAM.readUnsigned();
            block.transparencyIndex = STREAM.readByte();
            block.terminator = STREAM.readByte();
            this.pushFrame(block.delayTime, url);
            this.TRANSPARENCY = block.transparencyGiven ? block.transparencyIndex : null;
        };
        let parseComExt = (block) => {
            block.comment = this.readSubBlocks(stream);
        };
        let parsePTExt = (block) => {
            STREAM.readByte();
            block.ptHeader = STREAM.readBytes(12);
            block.ptData = this.readSubBlocks(stream);
        };
        let parseAppExt = (block) => {
            var parseNetscapeExt = function (block) {
                STREAM.readByte();
                block.unknown = STREAM.readByte();
                block.iterations = STREAM.readUnsigned();
                block.terminator = STREAM.readByte();
            };
            var parseUnknownAppExt = (block) => {
                block.appData = this.readSubBlocks(stream);
            };
            STREAM.readByte();
            block.identifier = STREAM.read(8);
            block.authCode = STREAM.read(3);
            switch (block.identifier) {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        };
        let parseUnknownExt = (block) => {
            block.data = this.readSubBlocks(stream);
        };
        block.label = STREAM.readByte();
        switch (block.label) {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }
    }
    ;
    pushFrame(delay, url) {
        let FRAME_LIST = this.gifCache[url].frameList;
        if (!this.ctx) {
            return;
        }
        ;
        FRAME_LIST.push({
            delay,
            data: this.ctx.getImageData(0, 0, this.gifInfo.width, this.gifInfo.height)
        });
    }
    ;
    parseImg(img, stream, url) {
        let STREAM = stream;
        function deinterlace(pixels, width) {
            let newPixels = new Array(pixels.length);
            const rows = pixels.length / width;
            function cpRow(toRow, fromRow) {
                const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            }
            ;
            const offsets = [0, 4, 2, 1], steps = [8, 8, 4, 2];
            let fromRow = 0;
            for (var pass = 0; pass < 4; pass++) {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                    cpRow(toRow, fromRow);
                    fromRow++;
                }
            }
            return newPixels;
        }
        ;
        img.leftPos = STREAM.readUnsigned();
        img.topPos = STREAM.readUnsigned();
        img.width = STREAM.readUnsigned();
        img.height = STREAM.readUnsigned();
        let bits = this.byteToBitArr(STREAM.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = this.bitsToNum(bits.splice(0, 3));
        if (img.lctFlag) {
            img.lct = this.parseCT(1 << (img.lctSize + 1), stream);
        }
        img.lzwMinCodeSize = STREAM.readByte();
        const lzwData = this.readSubBlocks(stream);
        img.pixels = this.lzwDecode(img.lzwMinCodeSize, lzwData);
        if (img.interlaced) {
            img.pixels = deinterlace(img.pixels, img.width);
        }
        this.doImg(img, url);
    }
    ;
    readSubBlocks(stream) {
        let size, STREAM = stream, data = '';
        do {
            size = STREAM.readByte();
            data += STREAM.read(size);
        } while (size !== 0);
        return data;
    }
    ;
    lzwDecode(minCodeSize, data) {
        let pos = 0;
        function readCode(size) {
            let code = 0;
            for (let i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                    code |= (1 << i);
                }
                pos++;
            }
            return code;
        }
        ;
        let output = [], clearCode = 1 << minCodeSize, eoiCode = clearCode + 1, codeSize = minCodeSize + 1, dict = [];
        function clear() {
            dict = [];
            codeSize = minCodeSize + 1;
            for (let i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;
        }
        ;
        let code = null, last = null;
        while (true) {
            last = code;
            code = readCode(codeSize);
            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) {
                break;
            }
            ;
            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            }
            else {
                if (code !== dict.length) {
                    throw new Error('Invalid LZW code.');
                }
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);
            if (dict.length === (1 << codeSize) && codeSize < 12) {
                codeSize++;
            }
        }
        return output;
    }
    ;
    doImg(img, url) {
        let TEMP_CANVAS_CTX = this.ctx, TEMP_CANVAS = this.canvasTool, GIF_INFO = this.gifInfo;
        let FRAME_LIST = this.gifCache[url].frameList;
        if (!this.ctx) {
            TEMP_CANVAS_CTX = this.ctx = TEMP_CANVAS.getContext('2d');
        }
        const currIdx = FRAME_LIST.length, ct = img.lctFlag ? img.lct : GIF_INFO.gct;
        if (currIdx > 0) {
            if (this.LAST_DISPOSA_METHOD === 3) {
                if (this.CURRENT_FRAME_INDEX !== null && this.CURRENT_FRAME_INDEX > -1) {
                    TEMP_CANVAS_CTX.putImageData(FRAME_LIST[this.CURRENT_FRAME_INDEX].data, 0, 0);
                }
                else {
                    TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
                }
            }
            else {
                this.CURRENT_FRAME_INDEX = currIdx - 1;
            }
            if (this.LAST_DISPOSA_METHOD === 2) {
                TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
            }
        }
        let imgData = TEMP_CANVAS_CTX.getImageData(img.leftPos, img.topPos, img.width, img.height);
        img.pixels.forEach((pixel, i) => {
            if (pixel !== this.TRANSPARENCY) {
                imgData.data[i * 4 + 0] = ct[pixel][0];
                imgData.data[i * 4 + 1] = ct[pixel][1];
                imgData.data[i * 4 + 2] = ct[pixel][2];
                imgData.data[i * 4 + 3] = 255;
            }
        });
        TEMP_CANVAS_CTX.putImageData(imgData, img.leftPos, img.topPos);
    }
    ;
    byteToBitArr(bite) {
        let byteArr = [];
        for (let i = 7; i >= 0; i--) {
            byteArr.push(!!(bite & (1 << i)));
        }
        return byteArr;
    }
    ;
    bitsToNum(ba) {
        return ba.reduce(function (s, n) {
            return s * 2 + Number(n);
        }, 0);
    }
    ;
    parseCT(size, stream) {
        let ct = [];
        for (let i = 0; i < size; i++) {
            ct.push(stream.readBytes(3));
        }
        return ct;
    }
    ;
}
exports.SLUCanvasGif = SLUCanvasGif;
class Stream {
    constructor(data) {
        this.pos = 0;
        this.data = data;
        this.len = data.length;
        this.pos = 0;
    }
    readByte() {
        if (this.pos >= this.data.length) {
            throw new Error('Attempted to read past end of stream.');
        }
        if (this.data instanceof Uint8Array)
            return this.data[this.pos++];
        else
            return this.data.charCodeAt(this.pos++) & 0xFF;
    }
    ;
    readBytes(n) {
        let bytes = [];
        for (let i = 0; i < n; i++) {
            bytes.push(this.readByte());
        }
        return bytes;
    }
    ;
    read(n) {
        let chars = '';
        for (let i = 0; i < n; i++) {
            chars += String.fromCharCode(this.readByte());
        }
        return chars;
    }
    ;
    readUnsigned() {
        let unsigned = this.readBytes(2);
        return (unsigned[1] << 8) + unsigned[0];
    }
    ;
}
;
//# sourceMappingURL=slu-canvas-gif.js.map