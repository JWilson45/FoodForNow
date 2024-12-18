const Quagga = require('@ericblade/quagga2');

const imagePath = './tabasco_barcode.jpg'; // Replace with your image path

Quagga.decodeSingle(
  {
    src: imagePath,
    numOfWorkers: 0, // Use 0 for Node.js
    inputStream: {
      size: 800, // Resize image for better performance
    },
    decoder: {
      readers: [
        'code_128_reader',
        'ean_reader',
        'upc_reader',
        'upc_e_reader',
        'code_39_reader',
      ],
    },
  },
  (result) => {
    if (result && result.codeResult) {
      console.log('Decoded barcode:', result.codeResult.code);
    } else {
      console.log('No barcode found.');
    }
  }
);
