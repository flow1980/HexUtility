import { hexFilePickerOpts, binFilePickerOpts, setButtonProgressState } from "../scripts/helper-functions.js";


/* Create a new worker, giving it the code in "IntelHexAndBinFile.js" 
   As soon as the worker is created, the worker script is executed.
   The first thing the worker does is start listening for messages from the main script.
   It does this using addEventListener(), which is a global function in a worker. */
const worker = new Worker('../scripts/IntelHexAndBinFile.js');


let hexFile;
let isAddressRangeValid = true;

const inputHexfile = document.getElementById("hex2bin-inputHexfile");
inputHexfile.addEventListener("change", selectHexfile);

/*
 * --------------------------------------------------------------------
 * Stores the information about the selected file.
 *    @param   ---
 *    @return  ---
 * --------------------------------------------------------------------
 */
function selectHexfile()
{
   hexFile = this.files[0];
   
   if ((hexFile) && (true === isAddressRangeValid))
   {
      buttonStartConversion.disabled = false;
   }
}


const addressRanges = document.getElementById("hex2bin-addressRanges");
document.addEventListener("click", function(){
   addressRanges.addEventListener("input", function(e){
      if(this.checkValidity())
      {
         isAddressRangeValid = true;
         if("" !== inputHexfile.value)
         {
            buttonStartConversion.disabled = false;
         }
      }
      else
      {
         isAddressRangeValid = false;
         buttonStartConversion.disabled = true;
      }
   });   
});


/*
 * --------------------------------------------------------------------
 * Resets the GUI/DOM by clearing the input elements and disabling the "Start Hex2Bin Conversion" button.
 *    @param   ---
 *    @return  ---
 * --------------------------------------------------------------------
 */
function resetGUI()
{
   setButtonProgressState(buttonStartConversion, "paused");
   
   inputHexfile.disabled = false;
   inputHexfile.value = "";

   addressRanges.disabled = false;
   addressRanges.value = "";

   buttonStartConversion.disabled = true;
}


const buttonStartConversion = document.getElementById("hex2bin-startConversion");
buttonStartConversion.addEventListener("click", startHex2Bin);


/* When the user clicks "Start Hex2Bin Conversion" AND the Input .hex file is loaded, 
   send a message to the worker.
   The message command is "Hex2Bin", and the message also contains the "hexFileContent",
   which is the complete content of the input .hex file. */
function startHex2Bin()
{
   const reader = new FileReader();
   let hexFileContent; 

   inputHexfile.disabled = true;
   setButtonProgressState(buttonStartConversion, "running");

   addressRanges.disabled = true;


   reader.addEventListener("load", () => {
      hexFileContent = reader.result;
      worker.postMessage({
         command: "Hex2Bin",
         hexFileContent: hexFileContent,
         addressRanges: addressRanges.value
      })
   });
   reader.readAsText(hexFile);
}


/* When the worker sends a message back to the main thread,
   download the bin file and reset the GUI */
worker.addEventListener("message", message => {
   switch(message.data.result)
   {
      case 0:
         for (let i = 0; i < message.data.binFileBlobArray.length; i++)
         {
            downloadBinfile(message.data.binFileBlobArray[i], i);
         }
         break;
      case 1:
         alert("ERROR: HEX file is corrupt !!!");
         break;
      case 2:
         alert("For at least one address range, the start address is not less than the end address !!!");
         break;
      deafult:
         break;
   }
   resetGUI();
});


function downloadBinfile(binFileBlob, index)
{   
   const link = document.createElement('a');
   link.style.display = 'none';
   const url = URL.createObjectURL(binFileBlob);
   link.href = url;
   link.download = hexFile.name.replace('.hex', `${index}.bin`);

   document.body.appendChild(link); /* It needs to be added to the DOM so it can be clicked. */
   link.click();
   document.body.removeChild(link);

   window.URL.revokeObjectURL(url);
}
