import { hexFilePickerOpts, binFilePickerOpts } from "../scripts/helper-functions.js";


let fileList;
let hexfileContent;
let binFile;

const inputElementHexfile = document.getElementById("inputHexfile");
inputElementHexfile.addEventListener("change", readHexfile, false);

async function readHexfile() {
   [fileList] = this.files;
   
   if (fileList) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
         hexfileContent = reader.result;
       });
       reader.readAsText(fileList);
   }
}

const btnElement = document.getElementById("hex2bin-downloadBinfile");
btnElement.addEventListener("click", downloadBinfile);

function downloadBinfile() {
   binFile = new Blob([hexfileContent]);
   const link = document.createElement('a');
   link.style.display = 'none';
   const url = URL.createObjectURL(binFile);
   link.href = url;
   link.download = fileList.name.replace('.hex', '.bin');

   document.body.appendChild(link); /* It needs to be added to the DOM so it can be clicked. */
   link.click();
   document.body.removeChild(link);
 
   window.URL.revokeObjectURL(url);
}
