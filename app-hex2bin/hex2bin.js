import { hexFilePickerOpts, binFilePickerOpts } from "../scripts/helper-functions.js";


let hexFile;
let hexFileContent;
let binFile;

const inputHexfile = document.getElementById("hex2bin-inputHexfile");
inputHexfile.addEventListener("change", readHexfile, false);

async function readHexfile() {
   hexFile = this.files[0];
   
   if (hexFile) {
      buttonStartConversion.disabled = false;
   }
}


const buttonStartConversion = document.getElementById("hex2bin-startConversion");
buttonStartConversion.addEventListener("click", Hex2Bin);

function Hex2Bin () {
   const reader = new FileReader();
   reader.addEventListener("load", () => {
      hexFileContent = reader.result;
      downloadBinfile();
   });
   reader.readAsText(hexFile);
}


function downloadBinfile() {
   binFile = new Blob([hexFileContent]);
   const link = document.createElement('a');
   link.style.display = 'none';
   const url = URL.createObjectURL(binFile);
   link.href = url;
   link.download = hexFile.name.replace('.hex', '.bin');

   document.body.appendChild(link); /* It needs to be added to the DOM so it can be clicked. */
   link.click();
   document.body.removeChild(link);
 
   window.URL.revokeObjectURL(url);
}
