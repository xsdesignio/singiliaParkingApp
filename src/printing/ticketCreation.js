import { Image } from 'react-native';
import base64 from "react-native-base64";

const logo_url = "../../assets/printer-logo.png";

const IMAGE_WIDTH = 8; // Adjust based on your printer's resolution
const IMAGE_HEIGHT = 8; // Adjust based on your printer's resolution


// const margin = '\r\n\r\n\r\n'
// const divider = '------------------------'


export function createEncodedTicketToBePrinted(data) {
    const IMAGE_WIDTH = 32; // Adjust as needed
    const IMAGE_HEIGHT = 32; // Adjust as needed

    const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);
    
    // Prepare the bitmap data. This is just an example for alternating lines.
    const sampleImage = [];
    for (let i = 0; i < IMAGE_HEIGHT; i++) {
        if (i % 2 === 0) {
            sampleImage.push("\xFF\x00\xFF\x00");
        } else {
            sampleImage.push("\x00\xFF\x00\xFF");
        }
    }
    const imageDataString = sampleImage.join("");

    // Mode: This is just an example value; adjust as per your printer's specification.
    const mode = "\x30";

    const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
    const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
    const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
    const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

    const initCommand = "\x1B\x40";
    const bitmapCommand = "\x1D\x76\x30" + mode + pL + pH + hL + hH;

    const contentToSend = initCommand + bitmapCommand + imageDataString;
    const contentToSendEncoded = base64.encode(contentToSend);

    console.log(contentToSendEncoded);

    return contentToSendEncoded;
}


export function createEncodedTicketToBePrinted3() {
    const IMAGE_WIDTH = 32;
    const IMAGE_HEIGHT = 32;
    const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);
    
    const sampleImage = [];
    for (let i = 0; i < 32; i++) {
        if (i % 2 === 0) {
            sampleImage.push("\xFF\x00\xFF\x00");
        } else {
            sampleImage.push("\x00\xFF\x00\xFF");
        }
    }
    const imageDataString = sampleImage.join("");

    const modes = ["0", "1", "2", "3"];  // added mode 3 for 8-dot density mode
    
    const lineFeed = "\x0A";

    let totalCommands = [];

    modes.forEach(mode => {
        const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
        const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
        const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
        const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

        const bitmapCommand = "\x1D\x76" + mode + pL + pH + hL + hH;
        totalCommands.push(bitmapCommand);
        totalCommands.push(imageDataString);
        totalCommands.push(lineFeed);
    });

    const contentToSend = totalCommands.join("");
    const contentToSendEncoded = base64.encode(contentToSend);

    console.log(contentToSendEncoded);
    
    return contentToSendEncoded;
}


export function createEncodedTicketToBePrinted2(data) {
    // Convert the image to monochrome bitmap
    console.log("This should be printed")

    let dataToSend = '\x1B\x21\x30';
    /* dataToSend += '\x1B\x45\x01'; 
    dataToSend += "Ticket de aparcamiento\nzona azul\n\n";
    dataToSend += '\x1B\x45\x00'; 
    dataToSend += '\x1B\x21\x20'; 

    dataToSend += margin;

    Object.entries(data).forEach(([key, value]) => {
        dataToSend += key + ": " + value + "\n";
    });

    dataToSend += margin;  
 */
    dataToSend += "\x1D\x28\x6B\x03\x00\x31\x43\x1D\x76\x30\x00"; // ESC/POS commands


    const dateToSend_encoded = base64.encode(dataToSend);


    const image = Image.resolveAssetSource(require(logo_url));

    console.log("Image: ")
    console.log(image)

    const logo = new Uint8Array([0x0, 0x1, 0x0, 0x1, 0x0, 0x1]);

    const logo_encoded = base64.encodeFromByteArray(logo);

    console.log("logo encoded: ")
    console.log(logo_encoded)

    const contentToSend = dateToSend_encoded + logo_encoded;
    console.log("content encoded: ")
    console.log(contentToSend)

    return contentToSend;
}

function obtainSampleBitMap() {
    const SAMPLE_WIDTH = 8; // Adjust as needed
    const SAMPLE_HEIGHT = 8; // Adjust as needed

    // Create a monochrome sample bitmap
    const sampleBitmap = new Uint8Array(SAMPLE_WIDTH * SAMPLE_HEIGHT);

    for (let y = 0; y < SAMPLE_HEIGHT; y++) {
        let row = 0;
        for (let x = 0; x < SAMPLE_WIDTH; x++) {
            // Create a simple checkerboard pattern with alternating 0s and 1s
            const pixelValue = (x + y) % 2 === 0 ? 0 : 1;
            row |= pixelValue << (SAMPLE_WIDTH - x - 1);
        }
        sampleBitmap.set([row], y * SAMPLE_WIDTH);
    }
    
    console.log(sampleBitmap);

    return base64.encodeFromByteArray(sampleBitmap);
}





async function convertToMonochromeBitmap(image) {
    // Load the image using the resolved asset source
    const imageData = await fetch(image.uri);
    console.log(image.uri)
    const buffer = await imageData.arrayBuffer();
    console.log(buffer)
    // console.log(buffer)
    const uint8Array = new Uint8Array(buffer);

    // Convert the image to monochrome
    const monochromeBitmap = new Uint8Array(IMAGE_WIDTH * IMAGE_HEIGHT);
    for (let y = 0; y < IMAGE_HEIGHT; y++) {
        let row = 0;
        for (let x = 0; x < IMAGE_WIDTH; x++) {
            const index = (y * IMAGE_WIDTH + x) * 4;
            const avg = (uint8Array[index] + uint8Array[index + 1] + uint8Array[index + 2]) / 3;
            const pixelValue = avg < 128 ? 0 : 1; // Change the threshold to your desired value
            row |= pixelValue << (IMAGE_WIDTH - x - 1);
        }
        monochromeBitmap.set([row], y * IMAGE_WIDTH);
    }

    console.log(monochromeBitmap)

    return monochromeBitmap;
}


/* 
export async function createEncodedTicketToBePrinted(data) {
    let dataToSend = '\x1B\x21\x30';
    dataToSend += '\x1B\x45\x01'; 
    dataToSend += "Ticket de aparcamiento\nzona azul\n\n";
    dataToSend += '\x1B\x45\x00'; 
    dataToSend += '\x1B\x21\x20'; 

    dataToSend += margin;

    Object.entries(data).forEach(([key, value]) => {
        dataToSend += key + ": " + value + "\n";
    });

    dataToSend += margin;  
    
    dataToSend += '\x1B\x33\x00';
    

    dataToSend += '\x1D\x28\x6B\x03\x00\x32\x32';

    // Convert the image to monochrome bitmap
    const image = Image.resolveAssetSource(require(logo_url));
    const monochromeBitmap = await convertToMonochromeBitmap(image);
    console.log(monochromeBitmap)

    // Append the image data length
    //const imageDataLength = IMAGE_WIDTH * IMAGE_HEIGHT / 8;
    //dataToSend += String.fromCharCode(imageDataLength & 0xFF, (imageDataLength >> 8) & 0xFF);

    // Append the monochrome image data
    dataToSend += monochromeBitmap;

    dataToSend += margin;

    return base64.encode(dataToSend);
    
} */




/* 
async function convertImageToPrintable(image_uri) {
    // Create a function that convert the image uri into a monochromatic bitmap printable into a mobile thermal printer using react-native-base-64 and react-native library
    // Load the image using the resolved asset source
    const imageData = await fetch(image_uri);

    const buffer = await imageData.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    // Convert the image to monochrome
    const monochromeBitmap = new Uint8Array(IMAGE_WIDTH * IMAGE_HEIGHT);
    for (let y = 0; y < IMAGE_HEIGHT; y++) {
        let row = 0;
        for (let x = 0; x < IMAGE_WIDTH; x++) {
            const index = (y * IMAGE_WIDTH + x) * 4;
            const avg = (uint8Array[index] + uint8Array[index + 1] + uint8Array[index + 2]) / 3;
            row |= avg < 128 ? (1 << (IMAGE_WIDTH - x - 1)) : 0;
        }
        monochromeBitmap.set([row], y * IMAGE_WIDTH);
    }

    // Convert Uint8Array to a string before encoding
    const monochromeString = String.fromCharCode.apply(null, monochromeBitmap);

    return monochromeString;

} */