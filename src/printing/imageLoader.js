import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
// import base64 from 'react-native-base64';

export async function loadAndEncodeImage ()  {
    try {
        // Load the image from the assets folder using Expo Asset
        const asset = Asset.fromModule(require('../../assets/logosBig.bmp'));
        await asset.downloadAsync();

        // Get the local URI of the downloaded file
        const localUri = asset.localUri;

        // Read the file using Expo FileSystem
        let base64_content = await FileSystem.readAsStringAsync(localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        let chunkSize = 64;
        const chunks = [];

        // Calculate the original BMP header size

        // Get the adjusted offset for Base64 encoding
        const offset = ((54 + 16)/3) * 4 * 2; // Each Base64 character represents 2 bytes in binary

        // Remove the BMP header
        base64_content = base64_content.slice(offset);
        // Split the Base64 string into chunks
        for (let i = 0; i < base64_content.length; i += chunkSize) {
            console.log(base64_content.slice(i, i + chunkSize))
            const chunk = base64_content.slice(i, i + chunkSize);
            chunks.push(chunk);
        }

        return chunks;
    }
    catch(e) {
        console.log(e);
    }
}
