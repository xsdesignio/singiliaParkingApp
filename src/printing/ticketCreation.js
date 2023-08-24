import base64 from "react-native-base64";
import { Image } from 'react-native'; // Import Image component from React Native

const logo_url = "../../assets/logo.png";



export async function createEncodedTicketToBePrinted(data) {
    let dataToSend = '\x1B\x61\x01';

    dataToSend += '\x1B\x21\x30'; // Set text size to normal
    dataToSend += '\x1B\x45\x01'; // Set the content below bold
    dataToSend += "Ticket de aparcamiento\nzona azul\n\n";
    dataToSend += '\x1B\x45\x00'; // Set the content below normal
    dataToSend += '\x1B\x21\x20'; // Set the content below small

    // Convert the image to base64
    const image = Image.resolveAssetSource(require(logo_url));
    const base64Image = `data:${image.type};base64,${await base64.encode(image.uri)}`;

    // Embed the image in the data
    dataToSend += `\n\n<img>${base64Image}</img>\n\n`;

    Object.entries(data).forEach(([key, value]) => {
        dataToSend += key + ": " + value + "\n";
    });

    dataToSend += '\n\n\n\n\n'; // Print text and line feed
    dataToSend += '\x1D\x56\x00';

    return base64.encode(dataToSend);
}
