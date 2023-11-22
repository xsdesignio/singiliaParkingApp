import base64 from "react-native-base64";
import { loadAndEncodeImage } from "./imageLoader";


const escPos = Object.freeze({
    INIT: '\x1B\x40',
    MOVE_LEFT: '\x1b\x61\x00',
    MOVE_RIGH: '\x1b\x5c',
    EMPHASIZED_ON: '\x1B\x45\x01',
    EMPHASIZED_OFF: '\x1B\x45\x00',
    FONT_A: '\x1B\x4D\x00',
    FONT_B: '\x1B\x4D\x01',
    FONT_C: '\x1B\x4D\x02',
    FONT_D: '\x1B\x4D\x03',
    CHARACTER_SIZE_0: '\x1B\x21\x01',
    CHARACTER_SIZE_1: '\x1B\x21\x00',
    CHARACTER_SIZE_2: '\x1B\x21\x30',
    CHARACTER_SIZE_3: '\x1B\x21\x20',
    CHARACTER_SPACING_1: '\x1B\x20\x00',
    CHARACTER_SPACING_2: '\x1B\x20\x02',
    LINE_HEIGHT_SMALL: '\x1B\x33\x22',
    LINE_HEIGHT_NORMAL: '\x1B\x33\x30',
    LINE_HEIGHT_BIG: '\x1B\x33\x42',
    ALIGN_LEFT: '\x1B\x61\x00',
    ALIGN_CENTER: '\x1B\x61\x01',
    ALIGN_RIGHT: '\x1B\x61\x03',
    BITMAP_PRINT: '\x1D\x76\x30'
})


const utils = Object.freeze({
    MARGIN: '\n\r',
    DIVIDER: '------------------------',
    LOGO: "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x07\x40\x00\x00\x00\x00\x00\x00\x00\x30\x18\x08\x00\x00\x00\x00\x0f\xc0\x00\x00\x00\x00\x00\x00\x00\x38\x18\x1c\x00\x00\x00\x00\x1f\xe0\x00\x00\x00\x00\x00\x00\x30\x38\x7c\x1c\x0c\x00\x00\x00\x1f\xe0\x00\x00\x00\x00\x00\x00\x30\x3e\xff\x7c\x1c\x00\x00\x00\x1f\xe0\x00\x00\x00\x00\x00\x00\x3a\xfe\x6e\x7e\x58\x00\x00\x00\x8f\xe0\x00\x00\x00\x00\x00\x00\x3e\x67\xa5\xee\xfc\x00\x00\x00\xcf\xc0\x00\x00\x00\x00\x00\x00\x7f\xb5\x7e\x6d\x7e\x00\x00\x00\x67\x80\x00\x00\x00\x00\x00\x00\x36\xbf\x55\xfd\x6c\x00\x00\x00\x60\x40\x00\x00\x00\x00\x00\x00\x16\xe5\xfe\x8b\xe8\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x00\x0d\x7f\xff\xfe\x30\x00\x00\x00\x38\x00\x00\x00\x00\x00\x00\x00\x07\xff\xff\xff\xe0\x00\x00\x00\x38\x00\x00\x00\x00\x00\x00\x00\x07\xff\x55\xff\xe0\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x07\xd4\x82\x57\xc0\x00\x00\x00\x3c\x00\x00\x00\x00\x00\x00\x00\x02\xff\xff\xfe\xc0\x00\x00\x00\x1e\x00\x00\x00\x00\x00\x00\x00\x01\xff\xff\xff\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x00\x17\xff\xf0\x00\x00\x00\x00\x1e\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x1f\xff\xff\xff\xf0\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x1f\xff\xf0\x02\x18\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x0f\xbf\xf0\x0d\x10\x00\x00\x00\x07\x00\x00\x00\x00\x00\x00\x00\x1f\x9f\xf0\x10\x90\x00\x00\x00\x0f\x80\x00\x00\x00\x00\x00\x00\x1f\xdf\x96\x10\x90\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x0f\x6f\x75\x10\x90\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x1e\xee\xd1\x8f\x08\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x1f\xff\x75\x01\x10\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x0f\xff\xda\x00\x90\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x1f\xff\x56\x00\x10\x00\x00\x00\x0f\xea\x00\x00\x00\x00",
    LOGO2: "\x00\x00\x1f\xff\xfa\x00\x10\x00\x00\x00\x07\xff\xc0\x00\x00\x00\x00\x00\x0f\x5f\x95\x8e\x90\x00\x00\x00\x0f\xff\xf0\x00\x00\x00\x00\x00\x1f\x1e\xd2\xcf\x88\x00\x00\x00\x07\x25\xfc\x00\x00\x00\x00\x00\x10\xa5\xd5\x47\x90\x00\x00\x00\x08\x10\x5f\x00\x00\x00\x00\x00\x09\x53\xc1\x33\x90\x00\x00\x00\x02\x42\x2f\x80\x00\x00\x00\x00\x1b\x17\x1a\xbf\x30\x40\x00\x00\x00\x49\x47\xc0\x00\x00\x00\x00\x19\x33\x00\xde\x48\x00\x00\x00\x0a\x4a\x00\xe0\x00\x00\x00\x00\x08\x87\x00\x0f\x50\x00\x00\x00\x15\x00\x80\x70\x00\x00\x00\x00\x1a\x12\x00\x86\x28\x00\x00\x00\x00\x00\xac\x38\x00\x00\x00\x00\x19\x33\x00\x07\x30\x00\x00\x00\x44\x00\x10\x18\x00\x00\x00\x00\x09\x12\x00\x87\x30\x00\x00\x00\x30\x00\x00\x0c\x00\x00\x00\x00\x18\x03\x00\x87\xd0\x00\x00\x00\x08\x00\x12\x06\x00\x00\x00\x00\x18\x43\x01\x07\x90\x00\x00\x00\xa0\x00\x05\x01\x00\x00\x00\x00\x0a\xeb\xc4\x0d\x90\x00\x00\x00\x80\x00\x02\x00\x00\x00\x00\x00\x19\xe7\xf4\x3a\xd0\x00\x00\x00\x20\x00\x04\x00\x00\x00\x00\x00\x08\xe1\xe0\x00\xd0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xe3\xec\x01\x90\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x1f\xff\x01\x00\x10\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0f\xff\xf5\x00\x20\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x07\xff\xf0\x00\x20\x00\x00\x00\x18\x00\x00\x00\x00\x00\x00\x00\x07\xf5\xf0\x30\x60\x00\x00\x00\x60\x00\x28\x00\x00\x00\x00\x00\x07\xf5\xf0\x20\x40\x00\x00\x00\x58\x00\x14\x00\x00\x00\x00\x00\x03\xf7\xf0\x30\xc0\x00\x00\x00\x10\x01\x00\x00\x00\x00\x00\x00\x01\xf7\xc8\x59\x80\x00\x00\x00\x02\xa5\x10\x00\x00\x00\x00\x00\x00\xf7\xd0\x4b\x00\x00\x00\x00\x05\x29\xc0\x00\x00\x00\x00\x00\x00\x7f\xe8\x06\x00\x00\x00\x00\x09\x28\x00\x00\x00\x00\x00\x00\x00\x3f\xf4\x0c\x00\x00\x00\x00\x01\x11\x40\x00\x00\x00\x00\x00\x00\x1f\xd0\x70\x00\x40\x00\x00\x00\x24\x00\x00\x00\x00\x00\x00\x00\x03\xfb\xc0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xbd\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
    LOGO_HEX: "\x00\x00\x01\x80\x00\x00\x00\x00\x00\x00\x07\xe0\x00\x00\x00\x00\x00\x00\x07\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x0f\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x8f\xf0\x00\x00\x00\x00\x00\x00\x47\xf0\x00\x00\x00\x00\x00\x00\x63\xe0\x00\x00\x00\x00\x00\x00\x30\x80\x00\x00\x00\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x00\x38\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x07\x00\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x07\xf4\x00\x00\x00\x00\x00\x00\x03\xff\xe0\x00\x00\x00\x00\x00\x07\xff\xfc\x00\x00\x00\x00\x00\x03\xd2\xff\x00\x00\x00\x00\x00\x06\x00\x0f\xc0\x00\x00\x00\x00\x00\x04\x43\xf0\x00\x00\x00\x00\x00\x20\x08\xf8\x00\x00\x00\x00\x01\x22\x40\x3c\x00\x00\x00\x00\x08\x02\x90\x0e\x00\x00\x00\x00\x05\x80\x00\x07\x00\x00\x00\x00\x00\x00\x28\x81\x80\x00\x00\x00\x22\x00\x03\x01\x80\x00\x00\x00\x20\x00\x02\x00\x40\x00\x00\x00\x0c\x00\x00\x00\x60\x00\x00\x00\x10\x00\x01\x50\x10\x00\x00\x00\x60\x00\x00\x60\x00\x00\x00\x00\x80\x00\x00\x40\x08\x00\x00\x00\x10\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x18\x00\x00\x00\x00\x00\x00\x00\x24\x00\x02\x00\x00\x00\x00\x00\x48\x00\x03\x40\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x00\x00\x10\x80\x51\x00\x00\x00\x00\x00\x01\x0a\x40\x00\x00\x00\x00\x00\x01\x88\x28\x00\x00\x00\x00\x00\x00\x0a\x20\x00\x00\x00\x00\x00\x00\x8a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
    ATQR_LOGO_HEX: "\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x02\x01\x80\x80\x00\x00\x00\x00\x01\x03\x01\x80\x00\x00\x00\x02\x03\xcd\xe5\x40\xc0\x00\x00\x03\x0d\x46\x47\x61\x40\x00\x00\x05\xc6\xb4\xb4\xa7\x40\x00\x00\x06\xaa\x46\xc6\x55\xa0\x00\x00\x05\x52\xd5\x35\x94\xc0\x00\x00\x02\x5a\x55\x48\xad\x00\x00\x00\x01\xc5\xaa\xef\x46\x00\x00\x00\x00\x36\xb7\x55\x71\x00\x00\x00\x00\xda\xda\xb5\xae\x00\x00\x00\x00\x55\x20\x0a\x5a\x00\x00\x00\x00\x32\xdf\xf5\xac\x00\x00\x00\x00\x1d\xa9\x56\xb0\x00\x00\x00\x00\x02\xd6\xba\x80\x00\x00\x00\x00\x00\x09\x00\x00\x00\x00\x00\x00\xaa\x52\xaa\xaa\x00\x00\x00\x01\xdb\xad\x55\x5b\x00\x00\x00\x01\x6a\xd6\x00\x40\x80\x00\x00\x01\x52\xb5\x01\x11\x00\x00\x00\x01\xb5\x55\x40\x08\x80\x00\x00\x00\xc9\xaa\x41\x09\x00\x00\x00\x01\x6c\xaa\x50\x90\x00\x00\x00\x01\x8a\xca\x18\x51\x00\x00\x00\x01\x75\x69\xc0\x09\x00\x00\x00\x01\x56\xaa\x60\x00\x80\x00\x00\x01\xaa\xb2\x80\x01\x00\x00\x00\x00\xdb\x5a\xa0\x00\x00\x00\x00\x01\x65\xa9\x58\xf1\x00\x00\x00\x01\xa1\x6d\x48\xa8\x80\x00\x00\x01\x14\x29\x24\x59\x00\x00\x00\x01\x52\xb1\x27\x69\x00\x00\x00\x01\x50\xa9\x12\xa4\x80\x00\x00\x01\x12\xa0\x09\x51\x00\x00\x00\x01\x80\x20\x00\xe4\x00\x00\x00\x01\x10\x60\x08\x53\x00\x00\x00\x01\x33\x20\x08\x62\x80\x00\x00\x01\x80\x20\x00\x35\x00\x00\x00\x01\x00\x60\x10\x59\x00\x00\x00\x01\x04\x30\x00\xd0\x80\x00\x00\x01\x5a\x58\x20\x69\x00\x00\x00\x01\x1d\x2e\x83\x0c\x00\x00\x00\x00\x14\x34\x00\x09\x00\x00\x00\x01\x16\x2a\xa0\x31\x00\x00\x00\x00\xea\xd0\x00\x01\x00\x00\x00\x00\xb5\x6a\xa0\x02\x00\x00\x00\x00\xd7\x5a\x00\x02\x00\x00\x00\x00\x59\x57\x02\x04\x00\x00\x00\x00\x6c\x94\x02\x04\x00\x00\x00\x00\x2a\xdb\x05\x08\x00\x00\x00\x00\x1a\xac\x82\x88\x00\x00\x00\x00\x16\xa9\x04\x30\x00\x00\x00\x00\x0a\xb4\x88\xa0\x00\x00\x00\x00\x05\xd6\x40\x80\x00\x00\x00\x00\x01\x5a\x83\x00\x00\x00\x00\x00\x00\x6a\x14\x00\x00\x00\x00\x00\x00\x17\xe8\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
})

// Encode the data that will be sent to the printer so it is understood by the printer and successfully printed.
export default class TemplateCreator {
    
    constructor() {
        this.template = []
    }

    obtainTemplateArray() {
        return this.template
    }

    margin(n = 1) {
        let command = utils.MARGIN.repeat(n)
        this.template.push(base64.encode(command))
        return this
    }

    initialize() {
        this.template.push(base64.encode(escPos.INIT));
        return this
    }

    alignLeft() {
        this.template.push(base64.encode(escPos.ALIGN_LEFT));
        return this
    }

    alignCenter() {
        this.template.push(base64.encode(escPos.ALIGN_CENTER));
        return this
    }

    alignRight() {
        this.template.push(base64.encode(escPos.ALIGN_RIGHT));
        return this
    }

    // Returns: list with the logo encoded content divided in two
    async Logo() {
        let image = await loadAndEncodeImage()
        
        const IMAGE_WIDTH = 64;
        const IMAGE_HEIGHT = 64;

        const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);

        
        const mode = "\x00";


        const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
        const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
        const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
        const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

        let imageSetup = base64.encode( 
                escPos.BITMAP_PRINT + 
                mode + pL + pH + hL + hH)

        this.template.push(imageSetup);

        
        this.template = [...this.template, ...image]
        
        return this
    }

    SingiliaLogo() {
        const IMAGE_WIDTH = 64;
        const IMAGE_HEIGHT = 64;

        const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);

        // Mode: This is just an example value; adjust as per your printer's specification.
        const mode = "\x00";

        const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
        const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
        const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
        const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

        let imageSetup = base64.encode( 
                escPos.BITMAP_PRINT + 
                mode + pL + pH + hL + hH)

        this.template.push(imageSetup);
        let logo = base64.encode(utils.LOGO_HEX)
        this.template.push(logo)
        
        return this;
    }
   
    AntequeraLogo() {
        const IMAGE_WIDTH = 64;
        const IMAGE_HEIGHT = 64;

        const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);

        // Mode: This is just an example value; adjust as per your printer's specification.
        const mode = "\x00";

        const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
        const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
        const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
        const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

        let imageSetup = base64.encode( 
                escPos.BITMAP_PRINT + 
                mode + pL + pH + hL + hH);

        this.template.push(imageSetup)
        this.template.push(base64.encode(utils.ATQR_LOGO_HEX))

        return this;
    }


    // @param title, the title to encode. Add \n to separate the title if needed (so words can't get splitted wrong).
    // @return the encoded title.
    Title(title) {

        let dataToSend = escPos.CHARACTER_SIZE_3;
        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend +=  "\n";
        dataToSend += title;
        dataToSend +=  "\n";
        dataToSend += escPos.EMPHASIZED_OFF;

        this.template.push(base64.encode(dataToSend));

        return this;
    }

    // Print a dict with the format "key: value"
    Dict(data) {
        let dataToSend = escPos.CHARACTER_SIZE_1;
        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend += escPos.CHARACTER_SPACING_2;


        Object.entries(data).forEach(([key, value]) => {
            dataToSend += this.formatStringToPrint(key + ": " + value + "\n");
        });

        dataToSend += escPos.EMPHASIZED_OFF;
        dataToSend += escPos.CHARACTER_SPACING_1;

        dataToSend += utils.MARGIN;

        this.template.push(base64.encode(dataToSend));
        return this
    }

    // Print the information related to Singilia Barba
    SingiliaInfo() {
        let dataToSend = escPos.CHARACTER_SIZE_0;
        dataToSend += escPos.LINE_HEIGHT_NORMAL;
        dataToSend += escPos.FONT_C;

        dataToSend += "Por Singilia Barba: ";
        dataToSend += "C.I.F.G 29.642.444\n";
        dataToSend += "Bda. Los Dolmenes (C.A.R), Bloque 1 - bajo\n";
        dataToSend += "Tlf./Fax: 952 70 17 70 ";
        dataToSend += "www.singiliabarba.org\n";

        dataToSend += escPos.FONT_A;

        dataToSend += utils.MARGIN;

        this.template.push(base64.encode(dataToSend))

        return this
    }


    // Show the prices table provided
    PricesTable(prices_table) {
        let dataToSend = escPos.CHARACTER_SIZE_0;

        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend += "TABLA DE PRECIOS:\n";
        dataToSend += escPos.EMPHASIZED_OFF;

        prices_table.forEach(price => {
            dataToSend += "------------------------\n";
            dataToSend += this.formatStringToPrint("- " + price["duration"] + ": " + price["price"] + " eur\n");
        })

        dataToSend += utils.MARGIN;

        
        this.template.push(base64.encode(dataToSend))

        return this
    }

    // Show the legal information related to the ticket
    LegalInfo() {
        let dataToSend = escPos.CHARACTER_SIZE_0;

        dataToSend += "Informacion legal:\n";
        dataToSend += "-Pago Obligatorio (Ordenanza Municipal num.20).\n";
        dataToSend += "-El boleto debera situarse en un lugar visible.\n";
        dataToSend += "-No se garantizan los objetos dejados en el interior\ndel vehiculo, accesorios exteriores, robos, incendios,\nni perjuicios causados con proposito de hurto.\n";

        dataToSend += utils.MARGIN;

        
        this.template.push(base64.encode(dataToSend))

        return this
    }

    BulletinLegalInfo() {
        let dataToSend = escPos.CHARACTER_SIZE_0;

        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend += "ANULACION DE BOLETIN (SI SE PAGA\nEN ORDENADOR DE ESTACIONAMIENTO O EN C.C):\n";
        dataToSend += escPos.EMPHASIZED_OFF;

        dataToSend += "-Pagar a ordenador de estacionamiento o en el C.C:\nIBAN ES 51 2103 3042 20 0030001171.\n";
        dataToSend += "-Como concepto el numero del boletin de denuncia y matricula.\n";
        dataToSend += "-Importe segun tabla.\n";
        dataToSend += "Tiempo estaccionado: Hora fin Regulacion-Hora\nBoletin Denuncia.\n";

        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend += "Ejemplar para la policia\n";
        dataToSend += escPos.EMPHASIZED_OFF;

        dataToSend += utils.MARGIN;

        
        this.template.push(base64.encode(dataToSend))

        return this
    }

    BulletinCancellationLegalInfo() {
        let dataToSend = escPos.CHARACTER_SIZE_0;

        dataToSend += escPos.EMPHASIZED_ON;
        dataToSend += "ANULACION DE BOLETIN (ANTES DE 48 HORAS)\n";
        dataToSend += escPos.EMPHASIZED_OFF;

        dataToSend += "-Pagar a ordenador de estacionamiento o en el C.C:\nIBAN ES 51 2103 3042 20 0030001171.\n";
        dataToSend += "-Como concepto el numero del boletin de denuncia y matricula.\n";
        dataToSend += "-Importe segun tabla:\n";
        dataToSend += "Tiempo estaccionado: Hora fin Regulacion-Hora\nBoletin Denuncia.";

        dataToSend += utils.MARGIN;

        
        this.template.push(base64.encode(dataToSend))

        return this
    }

    // This function formats the string so it can be printed correctly and ensures that no word is cut in the middle.
    // @param string, the string to format.
    formatStringToPrint(string) {
        let total_space = 32; // the max number of characters that can be printed in a line.
        let string_size = string.length;
        
        // If the string is smaller than a line (the total space), simply return it
        if (string_size < total_space) {
            return string;
        }

        let formatted_string = "";

        let words = string.split(" ");
        let consumed_space = 0;
        
        words.forEach(word => {
            if(consumed_space + word.length > total_space) {
                consumed_space = 0;
                formatted_string += "\n";
            }
            formatted_string += word + " ";
            consumed_space += word.length;
        })

        return formatted_string;
    }
}
