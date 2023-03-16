import { hexFilePickerOpts, binFilePickerOpts, hexFilePattern, isRawHexFile, convertHexStringToByteArray, convertByteArrayToHexstring } from "../scripts/helper-functions.js";


let hexFile;
let hexFileContent;
let binFile;

const inputHexfile = document.getElementById("hex2bin-inputHexfile");
inputHexfile.addEventListener("change", selectHexfile);

async function selectHexfile()
{
   hexFile = this.files[0];

   if (hexFile)
   {
      buttonStartConversion.disabled = false;
   }
}


const buttonStartConversion = document.getElementById("hex2bin-startConversion");
buttonStartConversion.addEventListener("click", startHex2Bin);

function startHex2Bin()
{
   const reader = new FileReader();
   reader.addEventListener("load", () => {
      hexFileContent = reader.result;
       Hex2Bin(hexFileContent);
   });
   reader.readAsText(hexFile);
}


function Hex2Bin(hexFileContent) {
   /*********************************************************************************/
   /*** Variables declarations                                                      */
   /*********************************************************************************/
   let result = 0;
   let addr = 0;
   let absaddr = 0;
   let currAbsaddr = 0;
   let offset = 0;
   let startIndex = 0;
   let endIndex = 0;

   let hexFileLines = hexFileContent.split("\n");
   let line = "";
   let lineAsBytes = [];
   let binFileContent = [];

   let matches = [];

   let recordType = "";

   if (isRawHexFile(hexFileContent))
   {
      for (let i = 0; (i < (hexFileLines.length)) && (hexFileLines[i].length > 0); i++)
      {
         let lineAsBytesObject = convertHexStringToByteArray(hexFileLines[i]);

         if (false == lineAsBytesObject.result)
         {
            result = 1;
         }
         else
         {
            binFileContent.push(...lineAsBytesObject.byteArray);
         }
      }
   }
   else 
   {
      for (let i = 0; (i < (hexFileLines.length)) && (0 === result) && (hexFileLines[i].length > 0); i++)
      {
         /* Match the regular expression pattern against a text string. */
         matches = hexFilePattern.exec(hexFileLines[i]);
         if (null !== matches)
         {
            /* 
               Filter for data records (record type '00') according to Intel HEX format
               The first element of the GroupCollection object (match.Groups[0]) contains a string
               that matches the entire regular expression pattern.
               Each subsequent element represents a captured group, if the regular expression includes
               capturing groups.
            */
            recordType = matches[3];
            /* Data Record */
            if ("00" === recordType)
            {
               let lineAsBytesObject = convertHexStringToByteArray(matches[4]);

               if (false == lineAsBytesObject.result)
               {
                  result = 1;
               }
               else
               {
                  binFileContent.push(...lineAsBytesObject.byteArray);
               }
            }
         }
         else
         {
            result = 1;
            
         }
     }
   }

   if (0 != result)
   {
      alert("Error: HEX file is corrupt !!!");
   }
   else
   {
      downloadBinfile(binFileContent);
   }

   return result;
}



function downloadBinfile(binFileContent)
{
   let byteArray = new Uint8Array(binFileContent);
   binFile = new Blob([byteArray], { type: "application/octet-stream" });
   
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
