import base64 from "react-native-base64";


// const margin = '\n\r\n\r'
// const divider = '------------------------'



// const logo_hex = "\x00\x00\x01\x80\x00\x00\x00\x00\x00\x00\x07\xe0\x00\x00\x00\x00\x00\x00\x07\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x0f\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x8f\xf0\x00\x00\x00\x00\x00\x00\x47\xf0\x00\x00\x00\x00\x00\x00\x63\xe0\x00\x00\x00\x00\x00\x00\x30\x80\x00\x00\x00\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x00\x38\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x07\x00\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x07\xf4\x00\x00\x00\x00\x00\x00\x03\xff\xe0\x00\x00\x00\x00\x00\x07\xff\xfc\x00\x00\x00\x00\x00\x03\xd2\xff\x00\x00\x00\x00\x00\x06\x00\x0f\xc0\x00\x00\x00\x00\x00\x04\x43\xf0\x00\x00\x00\x00\x00\x20\x08\xf8\x00\x00\x00\x00\x01\x22\x40\x3c\x00\x00\x00\x00\x08\x02\x90\x0e\x00\x00\x00\x00\x05\x80\x00\x07\x00\x00\x00\x00\x00\x00\x28\x81\x80\x00\x00\x00\x22\x00\x03\x01\x80\x00\x00\x00\x20\x00\x02\x00\x40\x00\x00\x00\x0c\x00\x00\x00\x60\x00\x00\x00\x10\x00\x01\x50\x10\x00\x00\x00\x60\x00\x00\x60\x00\x00\x00\x00\x80\x00\x00\x40\x08\x00\x00\x00\x10\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x18\x00\x00\x00\x00\x00\x00\x00\x24\x00\x02\x00\x00\x00\x00\x00\x48\x00\x03\x40\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x00\x00\x10\x80\x51\x00\x00\x00\x00\x00\x01\x0a\x40\x00\x00\x00\x00\x00\x01\x88\x28\x00\x00\x00\x00\x00\x00\x0a\x20\x00\x00\x00\x00\x00\x00\x8a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"


// Encode the data that will be sent to the printer so it is understood by the printer and successfully printed.
export default class PrinterCommunicationEncoder {
    
    constructor() {
        this.escPos = Object.freeze({
            INIT: '\x1B\x40',
            EMPHASIZED_ON: '\x1B\x45\x01',
            EMPHASIZED_OFF: '\x1B\x45\x00',
            FONT_A: '\x1B\x4D\x00',
            FONT_B: '\x1B\x4D\x01',
            FONT_C: '\x1B\x4D\x02',
            FONT_D: '\x1B\x4D\x03',
            CHARACTER_SIZE_1: '\x1B\x21\x00',
            CHARACTER_SIZE_2: '\x1B\x21\x30',
            CHARACTER_SIZE_3: '\x1B\x21\x20',
            CHARACTER_SPACING_1: '\x1B\x20\x00',
            CHARACTER_SPACING_2: '\x1B\x20\x02',
            ALIGN_CENTER: '\x1B\x61\x01',
            BITMAP_PRINT: '\x1D\x76\x30'
        })

        this.utils = Object.freeze({
            MARGIN: '\n\r\n\r',
            DIVIDER: '------------------------',
            LOGO_HEX: "\x00\x00\x01\x80\x00\x00\x00\x00\x00\x00\x07\xe0\x00\x00\x00\x00\x00\x00\x07\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x0f\xf0\x00\x00\x00\x00\x00\x00\x0f\xf8\x00\x00\x00\x00\x00\x00\x8f\xf0\x00\x00\x00\x00\x00\x00\x47\xf0\x00\x00\x00\x00\x00\x00\x63\xe0\x00\x00\x00\x00\x00\x00\x30\x80\x00\x00\x00\x00\x00\x00\x30\x00\x00\x00\x00\x00\x00\x00\x38\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x1c\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0e\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x0f\x00\x00\x00\x00\x00\x00\x00\x07\x00\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\x80\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x07\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xc0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x03\xe0\x00\x00\x00\x00\x00\x00\x07\xf4\x00\x00\x00\x00\x00\x00\x03\xff\xe0\x00\x00\x00\x00\x00\x07\xff\xfc\x00\x00\x00\x00\x00\x03\xd2\xff\x00\x00\x00\x00\x00\x06\x00\x0f\xc0\x00\x00\x00\x00\x00\x04\x43\xf0\x00\x00\x00\x00\x00\x20\x08\xf8\x00\x00\x00\x00\x01\x22\x40\x3c\x00\x00\x00\x00\x08\x02\x90\x0e\x00\x00\x00\x00\x05\x80\x00\x07\x00\x00\x00\x00\x00\x00\x28\x81\x80\x00\x00\x00\x22\x00\x03\x01\x80\x00\x00\x00\x20\x00\x02\x00\x40\x00\x00\x00\x0c\x00\x00\x00\x60\x00\x00\x00\x10\x00\x01\x50\x10\x00\x00\x00\x60\x00\x00\x60\x00\x00\x00\x00\x80\x00\x00\x40\x08\x00\x00\x00\x10\x00\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x18\x00\x00\x00\x00\x00\x00\x00\x24\x00\x02\x00\x00\x00\x00\x00\x48\x00\x03\x40\x00\x00\x00\x00\x10\x00\x00\x00\x00\x00\x00\x00\x10\x80\x51\x00\x00\x00\x00\x00\x01\x0a\x40\x00\x00\x00\x00\x00\x01\x88\x28\x00\x00\x00\x00\x00\x00\x0a\x20\x00\x00\x00\x00\x00\x00\x8a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
        })
    }


    // @param title, the title to encode. Add \n to separate the title if needed (so words can't get splitted wrong).
    // @return the encoded title.
    getEncodedTitle(title) {

        let dataToSend = this.escPos.CHARACTER_SIZE_3;
        dataToSend += this.escPos.EMPHASIZED_ON;
        dataToSend += title;
        dataToSend += this.escPos.EMPHASIZED_OFF;

        dataToSend += this.utils.MARGIN;

        return base64.encode(dataToSend);
    }

    getEncodedDict(data) {

        let dataToSend = this.escPos.CHARACTER_SIZE_1;
        dataToSend += this.escPos.EMPHASIZED_ON;
        dataToSend += this.escPos.CHARACTER_SPACING_2;

        Object.entries(data).forEach(([key, value]) => {
            if (key == "Id") {
                dataToSend += this.escPos.CHARACTER_SIZE_3;
                dataToSend += this.formatStringToPrint(key + ": " + value + "\n");
                dataToSend += this.escPos.CHARACTER_SIZE_1;
            } else if (key == "Hora") {
                dataToSend += this.escPos.CHARACTER_SIZE_3;
                dataToSend += this.formatStringToPrint(key + ": " + value + "\n");
                dataToSend += this.escPos.CHARACTER_SIZE_1;
            }
            else
                dataToSend += this.formatStringToPrint(key + ": " + value + "\n");
        });

        dataToSend += this.escPos.EMPHASIZED_OFF;
        dataToSend += this.escPos.CHARACTER_SPACING_1;

        dataToSend += this.utils.MARGIN;

        return base64.encode(dataToSend);
    }

    getSingiliaInfo() {
        let dataToSend = this.escPos.CHARACTER_SIZE_1;

        dataToSend += this.escPos.FONT_C;

        dataToSend += "Por Singilia Barba:\n";
        dataToSend += "C.I.F.G 29.642.444\n";
        dataToSend += "Bda. Los Dólmenes (C.A.R), Bloque 1 - bajo\n";
        dataToSend += "Tlf./Fax: 952 70 17 70\n";
        dataToSend += "www.singiliabarba.org\n";

        dataToSend += this.escPos.FONT_A;

        dataToSend += this.utils.MARGIN;

        return base64.encode(dataToSend);
    }

    getEncodedPricesTable(prices_table) {
        let dataToSend = this.escPos.CHARACTER_SIZE_1;

        dataToSend += this.escPos.EMPHASIZED_ON;
        dataToSend += "TABLA DE PRECIOS:\n";
        dataToSend += this.escPos.EMPHASIZED_OFF;

        prices_table.forEach(price => {
            dataToSend += "------------------------\n";
            dataToSend += this.formatStringToPrint("- " + price["duration"] + ": " + price["price"] + "€\n");
        })

        dataToSend += this.utils.MARGIN.repeat(2);

        return base64.encode(dataToSend);
    }

    getLegalInfo() {
        let dataToSend = this.escPos.CHARACTER_SIZE_1;

        dataToSend += "Información legal:\n";
        dataToSend += "-Pago Obligatorio (Ordenanza Municipal núm.20).\n";
        dataToSend += "-El boleto deberá situarse en un lugar visible.\n";
        dataToSend += "-No se garantizan los objetos dejados en el \ninterior del vehículo, accesorios exteriores, \nrobos, incendios, ni daños causados \ncon propósito de hurto. \n";

        dataToSend += this.utils.MARGIN.repeat(2);

        return base64.encode(dataToSend);
    }

    getBulletinLegalInfo() {
        let dataToSend = this.escPos.CHARACTER_SIZE_1;

        dataToSend += this.escPos.EMPHASIZED_ON;
        dataToSend += "ANULACIÓN DE BOLETÍN (SI SE PAGA\nEN ORDENADOR DE ESTACIONAMIENTO O EN C.C):\n";
        dataToSend += this.escPos.EMPHASIZED_OFF;

        dataToSend += "-Pagar a ordenador de estacionamiento o en el C.C: IBAN ES 51 2103 3042 20 0030001171.\n";
        dataToSend += "-Como concepto el nº del boletín\nde denuncia y matrícula.\n";
        dataToSend += "-Importe según tabla:\n";
        dataToSend += "Tiempo estaccionado: Hora fín Regulación (u Hora Salida Confirmada por Ordenador de\nEstacionamiento)-Hora Boletín Denuncia.\n";

        dataToSend += this.escPos.EMPHASIZED_ON;
        dataToSend += "Ejemplar para la policía\n";
        dataToSend += this.escPos.EMPHASIZED_OFF;

        dataToSend += this.utils.MARGIN.repeat(2);

        return base64.encode(dataToSend);
    }

    getSingiliaLogo() {
        const IMAGE_WIDTH = 64;
        const IMAGE_HEIGHT = 64;

        const IMAGE_WIDTH_BYTES = Math.ceil(IMAGE_WIDTH / 8);

        // Mode: This is just an example value; adjust as per your printer's specification.
        const mode = "\x33";

        const pL = String.fromCharCode(IMAGE_WIDTH_BYTES & 0xFF);
        const pH = String.fromCharCode((IMAGE_WIDTH_BYTES >> 8) & 0xFF);
        const hL = String.fromCharCode(IMAGE_HEIGHT & 0xFF);
        const hH = String.fromCharCode((IMAGE_HEIGHT >> 8) & 0xFF);

        let logoToBeSent = this.escPos.INIT + 
                            this.escPos.ALIGN_CENTER + 
                            this.escPos.BITMAP_PRINT + 
                            mode + pL + pH + hL + hH + 
                            this.utils.LOGO_HEX +
                            this.utils.MARGIN;
        
        return base64.encode(logoToBeSent);
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
