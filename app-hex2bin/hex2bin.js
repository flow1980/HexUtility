import { hexFilePickerOpts, binFilePickerOpts } from "../scripts/helper-functions.js";


let hexfileContent;

const inputElementHexfile = document.getElementById("inputHexfile");
inputElementHexfile.addEventListener("change", readHexfile, false);

async function readHexfile() {
   const [fileList] = this.files;
   
   if (fileList) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
         hexfileContent = reader.result;
         console.log(hexfileContent);
       });
       reader.readAsText(fileList);
   }
}



