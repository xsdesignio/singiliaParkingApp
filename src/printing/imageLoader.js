import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { toByteArray, fromByteArray } from 'base64-js';


export async function loadAndEncodeImage() {
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

        const invertedBase64 = invertLogo(base64_content, 256, 128)
        
        const result = sliceStringIntoChunks(invertedBase64, 128);

        return result;

    } catch (e) {
        console.error(e);
    }
}


function invertLogo(base64_content, width = 64, height = 64) {
    let bytesArray = toByteArray(base64_content);

    width = width/8;

    bytesArray = bytesArray.slice(-(width*height))

    let resultArray = new Uint8Array(bytesArray.length);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const sourceIndex = y * width + x;
            const destinationIndex = (height - y ) * width + x;

            resultArray[destinationIndex] = 255 - bytesArray[sourceIndex];
        }
    }

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