import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { toByteArray, fromByteArray } from 'base64-js';


let image_chunks = null;


// Load and encode the image.
// Save it into image_chunks so it doesn't have to repeat the loading process at every call
export async function loadAndEncodeImage() {
    // Check the image has already been load and return it if so
    if(image_chunks != null)
        return image_chunks;

    try {
        // Load the image from the assets folder using Expo Asset
        const asset = Asset.fromModule(require('../../assets/logos.bmp'));
        await asset.downloadAsync();

        // Get the local URI of the downloaded file
        const localUri = asset.localUri;

        // Read the file using Expo FileSystem
        let base64_content = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const invertedImage = invertLogo(base64_content, 256, 128);
        const slicedImage = sliceStringIntoChunks(invertedImage, 256);

        // Set image chunks to return next time the function is called
        image_chunks = slicedImage;

        return slicedImage;

    } catch (e) {
        console.error(e);
    }
}


function invertLogo(base64_image, width = 64, height = 64) {
    // Obtaining the pixels from the base64_image
    let bytesArray = toByteArray(base64_image);

    width = width/8; // As it is devided by bytes

    bytesArray = bytesArray.slice(-(width*height)) // Obtain the image pixels acording to size

    let resultArray = new Uint8Array(bytesArray.length);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sourceIndex = y * width + x;
            const destinationIndex = (height - y ) * width + x;

            resultArray[destinationIndex] = 255 - bytesArray[sourceIndex];
        }
    }

    // Coming back to base64 encoding after logo inverted
    const base64Result = fromByteArray(resultArray);
    return base64Result;
}


function sliceStringIntoChunks(inputString, chunkLength) {
    const chunks = [];

    for(let i = 0; i < inputString.length; i += chunkLength) {
        chunks.push(inputString.slice(i, i + chunkLength));
    }

    return chunks;
}