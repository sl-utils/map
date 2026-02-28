/**canvas绘制gif工具类 */
export class SLUCanvasGif {
    constructor() { }
    /** 用来拿 imagedata 的工具人*/
    private canvasTool: HTMLCanvasElement = document.createElement("canvas");
    /** 工具人的 getContext('2d')不能初始化，否则可能出现空白帧*/
    private ctx: CanvasRenderingContext2D;
    private gifInfo: GifInfo;
    private LAST_DISPOSA_METHOD: number | null = null;
    /**当前帧的下标*/
    private CURRENT_FRAME_INDEX = -1;
    private TRANSPARENCY: any = null;
    private CTX: CanvasRenderingContext2D;
    /**缓存的数据 */
    private gifCache: { [url: string]: GifCache } = {};
    /**存放动画id用于停止之前绘制的动画 */
    private aniIds: { [id: string]: number | null } = {};
    private opts: CanvasGifOpt[] = [];
    private timeId: number;
    /**加载gif并进行缓存 , 避免重复请求 url */
    public async loadGIF(opt: CanvasGifOpt, ctx: CanvasRenderingContext2D) {
        let { url } = opt;
        let cache = this.gifCache[url];
        this.CTX = ctx;
        if (!cache) {
            /**缓存中没有该url的数据，初始化为请求状态 */
            this.gifCache[url] = { status: 0, data: null, frameList: [] };
            cache = this.gifCache[url];
            try {
                /**设置状态为正在请求 */
                cache.status = 1;
                const data = await this.fetchGIF(url);
                const stream = new Stream(data);
                /**设置状态为请求完毕 */
                cache.status = 2;
                this.parseHeader(url, stream);
                this.parseBlock(opt, stream);
            } catch (error) {
                console.error('Error loading GIF:', error);
            }
        } else {
            if (cache.status === 1) {
                /**记录状态为1的opt */
                this.opts.push(opt);
                clearTimeout(this.timeId)
                this.timeId = setTimeout(() => {
                    console.log(this.opts)
                    let opts = this.opts; this.opts = [];
                    opts.forEach(e => this.loadGIF(e, this.CTX));
                }, 100)
            } else if (cache.status === 2) {
                /**状态请求完毕，直接播放 GIF */
                this.stopGif(opt);
                this.playGif(opt);
            }
        }
    }
    private fetchGIF(url: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            // 浏览器兼容处理
            if ('overrideMimeType' in xhr) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    if (data.toString().indexOf('ArrayBuffer') > 0) {
                        resolve(new Uint8Array(data));
                    } else {
                        resolve(data);
                    }
                } else {
                    reject(new Error('XHR Error - Response'));
                }
            };
            xhr.onerror = () => {
                reject(new Error('XHR Error'));
            };
            xhr.send();
        });
    }
    /**解析数据流头部并设置工具canvas的宽高 */
    private parseHeader(url: any, stream: any): void {
        let STREAM = stream, GIF_INFO: GifInfo = this.gifInfo = Object.create(null), canvas = this.canvasTool;
        /**gif文件标识 */
        GIF_INFO.sig = STREAM.read(3);
        /**版本号 */
        GIF_INFO.ver = STREAM.read(3);
        if (GIF_INFO.sig !== 'GIF') throw new Error('Not a GIF file.');
        GIF_INFO.width = STREAM.readUnsigned();
        GIF_INFO.height = STREAM.readUnsigned();
        let bits = this.byteToBitArr(STREAM.readByte());
        GIF_INFO.gctFlag = !!bits.shift();
        GIF_INFO.colorRes = this.bitsToNum(bits.splice(0, 3));
        GIF_INFO.sorted = !!bits.shift();
        GIF_INFO.gctSize = this.bitsToNum(bits.splice(0, 3));
        GIF_INFO.bgColor = STREAM.readByte();
        GIF_INFO.pixelAspectRatio = STREAM.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (GIF_INFO.gctFlag) {
            GIF_INFO.gct = this.parseCT(1 << (GIF_INFO.gctSize + 1), stream);
        }
        // 给 canvas 设置大小
        canvas.width = GIF_INFO.width;
        canvas.height = GIF_INFO.height;
        canvas.style.width = GIF_INFO.width + 'px';
        canvas.style.height = GIF_INFO.height + 'px';
        canvas.getContext('2d')!.setTransform(1, 0, 0, 1, 0, 0);
    };
    /**解析内容块 */
    private parseBlock(opt: CanvasGifOpt, stream: any) {
        let block: GifBlock = Object.create(null), STREAM = stream;
        block.sentinel = STREAM.readByte();
        switch (String.fromCharCode(block.sentinel)) { // For ease of matching
            case '!':
                block.type = 'ext';
                this.parseExt(block, stream, opt.url);
                break;
            case ',':
                /**图像标识符以','(0x2c)作为开始标志 */
                block.type = 'img';
                this.parseImg(block, stream, opt.url);
                break;
            case ';':
                block.type = 'eof';
                // 已经结束啦。结束就跑这
                this.playGif(opt);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16));
        }
        // 递归
        if (block.type !== 'eof') {
            this.parseBlock(opt, stream);
        }
    };
    /**播放gif */
    private playGif(opt: CanvasGifOpt, index: number = 0) {
        const that = this, { delay = 0 } = opt;
        const { frameList: list } = that.gifCache[opt.url], len = list.length;
        let lastTimestamp: number | undefined;
        const animate = (timestamp: number) => {
            if (lastTimestamp === undefined) lastTimestamp = timestamp;
            const elapsed = timestamp - (lastTimestamp || timestamp);
            if (elapsed >= delay) {
                lastTimestamp = timestamp;
                index++;
                if (index >= len) {
                    index = 0;
                }
            };
            that.drawFrame(opt, index);
            that.aniIds[opt.id] = requestAnimationFrame(animate);
        };
        that.aniIds[opt.id] = requestAnimationFrame(animate);
    }
    /**绘制每一帧 */
    private drawFrame(opt: CanvasGifOpt, index: number) {
        const that = this, ctx = that.CTX;
        let { point, points = [], size = [100, 100], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1, delay } = opt;
        let { frameList: list } = that.gifCache[opt.url];
        that.canvasTool.getContext("2d")!.putImageData(list[index].data, 0, 0);
        // ctx.globalCompositeOperation = "copy";
        let imgEle = that.canvasTool;
        let sizeX: number = size[0],
            sizeY: number = size[1],
            sizeOX = sizeo && sizeo[0],
            sizeOY = sizeo && sizeo[1];
        if (point) points = [...points, point];
        for (let i = 0; i < points.length; i++) {
            const e = points[i],
                x = e[0],
                y = e[1];
            rotate = (rotate * Math.PI) / 180;
            ctx.globalAlpha = alpha;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(rotate);
            if (sizeOX && sizeOY) {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            } else {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            ctx.rotate(-rotate);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    /**关闭之前的定时动画 */
    private stopGif(opt: CanvasGifOpt) {
        const that = this, aniId = that.aniIds[opt.id];
        if (!aniId) return;
        cancelAnimationFrame(aniId);
        that.aniIds[opt.id] = null;
    }
    // 解析
    private parseExt(block: any, stream: any, url: any) {
        let STREAM = stream
        let parseGCExt = (block: any) => {
            STREAM.readByte(); // Always 4 这个必须得这样执行一次
            var bits = this.byteToBitArr(STREAM.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.
            block.disposalMethod = this.bitsToNum(bits.splice(0, 3));
            this.LAST_DISPOSA_METHOD = block.disposalMethod

            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = STREAM.readUnsigned();
            block.transparencyIndex = STREAM.readByte();
            block.terminator = STREAM.readByte();
            this.pushFrame(block.delayTime, url);
            this.TRANSPARENCY = block.transparencyGiven ? block.transparencyIndex : null;
        };
        let parseComExt = (block: any) => {
            block.comment = this.readSubBlocks(stream);
        };
        let parsePTExt = (block: any) => {
            // No one *ever* uses this. If you use it, deal with parsing it yourself.
            STREAM.readByte(); // Always 12 这个必须得这样执行一次
            block.ptHeader = STREAM.readBytes(12);
            block.ptData = this.readSubBlocks(stream);
        };
        let parseAppExt = (block: any) => {
            var parseNetscapeExt = function (block: any) {
                STREAM.readByte(); // Always 3 这个必须得这样执行一次
                block.unknown = STREAM.readByte(); // ??? Always 1? What is this?
                block.iterations = STREAM.readUnsigned();
                block.terminator = STREAM.readByte();
            };
            var parseUnknownAppExt = (block: any) => {
                block.appData = this.readSubBlocks(stream);
                // FIXME: This won't work if a handler wants to match on any identifier.
                // handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            };
            STREAM.readByte(); // Always 11 这个必须得这样执行一次
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
        let parseUnknownExt = (block: any) => {
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
    };
    private pushFrame(delay: any, url: any) {
        let FRAME_LIST = this.gifCache[url].frameList;
        if (!this.ctx) {
            return
        };
        FRAME_LIST.push({
            delay,
            data: this.ctx.getImageData(0, 0, this.gifInfo.width, this.gifInfo.height)
        });
    };
    private parseImg(img: GifImg, stream: any, url: any) {
        let STREAM = stream;
        function deinterlace(pixels: any, width: any) {
            // Of course this defeats the purpose of interlacing. And it's *probably*
            // the least efficient way it's ever been implemented. But nevertheless...
            let newPixels = new Array(pixels.length);
            const rows = pixels.length / width;

            function cpRow(toRow: any, fromRow: any) {
                const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            };

            // See appendix E.
            const offsets = [0, 4, 2, 1],
                steps = [8, 8, 4, 2];

            let fromRow = 0;
            for (var pass = 0; pass < 4; pass++) {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                    cpRow(toRow, fromRow)
                    fromRow++;
                }
            }

            return newPixels;
        };
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
        if (img.interlaced) { // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }
        this.doImg(img, url);
    };
    /**读取数据块 */
    private readSubBlocks(stream: any): string {
        let size: number, STREAM = stream,
            // let size: number, STREAM = this.stream,
            data = '';
        do {
            size = STREAM.readByte();
            data += STREAM.read(size);
        } while (size !== 0);
        return data;
    };
    /**解码LZW编码 */
    private lzwDecode(minCodeSize: number, data: string): number[] {
        // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
        // Maybe this streaming thing should be merged with the Stream?
        let pos = 0;
        function readCode(size: number) {
            let code = 0;
            for (let i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                    code |= (1 << i);
                }
                pos++;
            }
            return code;
        };

        let output: any[] = [],
            clearCode = 1 << minCodeSize,
            eoiCode = clearCode + 1,
            codeSize = minCodeSize + 1,
            dict: any[] = [];

        function clear() {
            dict = [];
            codeSize = minCodeSize + 1;
            for (let i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;
        };

        let code: any = null,
            last: any = null;
        while (true) {
            last = code!;
            code = readCode(codeSize);

            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) {
                break
            };
            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            } else {
                if (code !== dict.length) {
                    throw new Error('Invalid LZW code.');
                }
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);

            if (dict.length === (1 << codeSize) && codeSize < 12) {
                // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
                codeSize++;
            }
        }
        return output;
    };
    /** */
    private doImg(img: GifImg, url: string) {
        let TEMP_CANVAS_CTX = this.ctx, TEMP_CANVAS = this.canvasTool, GIF_INFO = this.gifInfo;
        let FRAME_LIST = this.gifCache[url].frameList;
        if (!this.ctx) {
            // 没有就创建
            TEMP_CANVAS_CTX = this.ctx = TEMP_CANVAS.getContext('2d')!;
        }
        const currIdx = FRAME_LIST.length,
            ct = img.lctFlag ? img.lct : GIF_INFO.gct;
        if (currIdx > 0) {
            // 这块不要动
            if (this.LAST_DISPOSA_METHOD === 3) {
                // Restore to previous
                // If we disposed every TEMP_CANVAS_CTX including first TEMP_CANVAS_CTX up to this point, then we have
                // no composited TEMP_CANVAS_CTX to restore to. In this case, restore to background instead.
                if (this.CURRENT_FRAME_INDEX !== null && this.CURRENT_FRAME_INDEX > -1) {
                    TEMP_CANVAS_CTX.putImageData(FRAME_LIST[this.CURRENT_FRAME_INDEX].data, 0, 0);
                } else {
                    TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
                }
            } else {
                this.CURRENT_FRAME_INDEX = currIdx - 1;
            }

            if (this.LAST_DISPOSA_METHOD === 2) {
                // Restore to background color
                // Browser implementations historically restore to transparent; we do the same.
                // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
            }
        }
        let imgData = TEMP_CANVAS_CTX.getImageData(img.leftPos, img.topPos, img.width, img.height);
        img.pixels.forEach((pixel: any, i: number) => {
            if (pixel !== this.TRANSPARENCY) {
                imgData.data[i * 4 + 0] = ct[pixel][0];
                imgData.data[i * 4 + 1] = ct[pixel][1];
                imgData.data[i * 4 + 2] = ct[pixel][2];
                imgData.data[i * 4 + 3] = 255; // Opaque.
            }
        });
        TEMP_CANVAS_CTX.putImageData(imgData, img.leftPos, img.topPos);
    };

    /**数字转换为对应的位然后变为长度为7的boolean数组
     * @param bite number 
     */
    private byteToBitArr(bite: number): boolean[] {
        let byteArr: boolean[] = [];
        for (let i = 7; i >= 0; i--) {
            byteArr.push(!!(bite & (1 << i)));
        }
        return byteArr;
    };
    /**boolean数组转换为对应的数字
     * @param ba boolean[]
     */
    private bitsToNum(ba: boolean[]): number {
        return ba.reduce(function (s, n) {
            return s * 2 + Number(n);
        }, 0);
    };
    /**获取全局颜色列表
     * @param size 全局颜色列表大小
     */
    private parseCT(size: number, stream: Stream): [number, number, number][] { // Each entry is 3 bytes, for RGB.
        let ct: [number, number, number][] = [];
        for (let i = 0; i < size; i++) {
            ct.push(stream.readBytes(3) as [number, number, number]);
        }
        return ct;
    };
}

/**数据流解析类 */
class Stream {
    constructor(data: any) {
        this.data = data;
        this.len = data.length;
        this.pos = 0;
    }
    /**数据流 */
    private data: string | Uint8Array;
    /**数据流长度 */
    private len: number;
    /**数据流现在读取的位置 */
    private pos: number = 0;
    /**读取一字节（8位）的数据 */
    public readByte(): number {
        if (this.pos >= this.data.length) {
            throw new Error('Attempted to read past end of stream.');
        }
        if (this.data instanceof Uint8Array)
            return this.data[this.pos++];
        else
            return this.data.charCodeAt(this.pos++) & 0xFF;
    };
    /**读取指定长度的数据 */
    public readBytes(n: number): number[] {
        let bytes: number[] = [];
        for (let i = 0; i < n; i++) {
            bytes.push(this.readByte());
        }
        return bytes;
    };
    /**获取指定长度字符串 */
    public read(n: number): string {
        let chars = '';
        for (let i = 0; i < n; i++) {
            chars += String.fromCharCode(this.readByte());
        }
        return chars;
    };
    /**读取无符号数据2字节 最大：255<<8 + 255 */
    public readUnsigned(): number { // Little-endian.
        let unsigned = this.readBytes(2);
        return (unsigned[1] << 8) + unsigned[0];
    };
};

/**canvas绘制gif的配置 */
interface CanvasGifOpt extends CanvasGif {
    size: [number, number];
    point: [number, number];
    points: [number, number][];
    /**gif每一帧延迟的时间，控制整体播放速度 */
    delay?: number;
}

/**Gif信息（属性顺序就是数据流顺序）*/
interface GifInfo {
    /**（3字节）gif文件标识*/
    sig: string;
    /**（3字节）版本*/
    ver: string;
    /**（2字节）像素宽*/
    width: number;
    /**（2字节）像素高*/
    height: number;
    /**（1位）全局颜色列表标志(Global Color Table Flag)，当置位时表示有全局颜色列表，pixel值有意义*/
    gctFlag: boolean;
    /**（3位）颜色深度(Color ResoluTion)，cr+1确定图象的颜色深度*/
    colorRes: number;
    /**（1位）分类标志(Sort Flag)，如果置位表示全局颜色列表分类排列*/
    sorted: boolean;
    /**（3位）全局颜色列表大小，pixel+1确定颜色列表的索引数=（2^(pixel+1)）*/
    gctSize: number;
    /**（1字节）背景颜色：背景颜色在全局颜色列表中的索引（PS:是索引而不是RGB值，所以如果没有全局颜色列表时，该值没有意义）*/
    bgColor: number;
    /**（1字节）全局像素的宽度与高度的比值 */
    pixelAspectRatio: number;
    /**全局颜色列表  [R,G,B][]*/
    gct: number[][];
}
/**图像标识符 */
interface GifImg {
    /**（2字节）X方向偏移量 */
    leftPos: number;
    /**（2字节）Y方向偏移量 */
    topPos: number;
    /**（2字节）图像宽 */
    width: number;
    /**（2字节）图像高 */
    height: number;
    /**（1位）局部颜色列表标志(Local Color Table Flag) 置位时标识紧接在图象标识符之后有一个局部颜色列表，供紧跟在它之后的一幅图象使用；值否时使用全局颜色列表，忽略pixel值。 */
    lctFlag?: boolean;
    /**（1位）交织标志(Interlace Flag)，置位时图象数据使用交织方式排列，否则使用顺序排列 */
    interlaced?: boolean;
    /**（1位）分类标志(Sort Flag)，如果置位表示紧跟着的局部颜色列表分类排列 */
    sorted?: boolean;
    /**（2位）保留，必须初始化为0 */
    reserved: boolean[];
    /**（3位）局部颜色列表大小(Size of Local Color Table)，pixel+1就为颜色列表的位数 */
    lctSize: number;
    lct: number[][];
    /**（1字节）LZW编码长度 */
    lzwMinCodeSize: number;
    /** */
    pixels: any
}
interface GifBlock extends GifImg {
    sentinel: number;
    type: string;
}

interface GifCache {
    /**status资源请求的状态0未请求1请求中2已请求 */
    status: 0 | 1 | 2,
    /**data缓存的gif数据 */
    data: ArrayBuffer | null,
    /**frameList存放每一帧以及对应的延时 */
    frameList: { delay: number, data: ImageData }[]
} 
