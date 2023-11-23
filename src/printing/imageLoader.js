/* import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset'; */
import { toByteArray, fromByteArray } from 'base64-js';
import { API_URL } from "../enviroment"

const apiHost = API_URL 

let image_chunks = [];

// ...

// Load and encode the image.
// Save it into image_chunks so it doesn't have to repeat the loading process at every call
export async function loadAndEncodeImage() {
    // Check if the image has already been loaded and return it if so
    if (image_chunks.length > 0) return image_chunks;
  
    try {
      // URL de la imagen en tu servidor Flask
      const imageUrl = `${apiHost}/printer-logo`;
  
        // Fetch the image from the server
        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64_content = fromByteArray(new Uint8Array(arrayBuffer));

        // Realiza la lógica de procesamiento de la imagen aquí
        const invertedImage = invertLogo(base64_content, 256, 128);
        const slicedImage = sliceStringIntoChunks(invertedImage, 64);
    
        // Establece los fragmentos de la imagen para devolver la próxima vez que se llame a la función
        image_chunks = slicedImage;
    
        return slicedImage;
        } catch (e) {
        console.error(e);
        throw new Error(e.message);
        }
  }

  
/* 
// Load and encode the image.
// Save it into image_chunks so it doesn't have to repeat the loading process at every call
export async function loadAndEncodeImage() {
    // Check the image has already been load and return it if so
    if(image_chunks.length > 0)
        return image_chunks;

    try {
        // Load the image from the assets folder using Expo Asset
        let imageUrl = '../../assets/logos.bmp';
        
        const asset = Asset.fromModule(require(imageUrl));
        await asset.downloadAsync();

        // Get the local URI of the downloaded file
        const localUri = asset.localUri; 
        const [{ localUri }] = await Asset.loadAsync(require(imageUrl));
        if(!localUri)
            throw Error("Error obteniendo la ruta de la imagen de los logos")
 
        // Read the file using Expo FileSystem
        let base64_content = await FileSystem.readAsStringAsync(imageUrl, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const invertedImage = invertLogo(base64_content, 256, 128);
        const slicedImage = sliceStringIntoChunks(invertedImage, 64);

        // Set image chunks to return next time the function is called
        image_chunks = slicedImage;

        return slicedImage;

    } catch (e) {
        console.error(e);
        throw Error(e.message)
    }
}
 */

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