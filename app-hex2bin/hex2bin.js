import { hexFilePickerOpts, binFilePickerOpts, setButtonProgressState } from "../scripts/helper-functions.js";


/* Create a new worker, giving it the code in "IntelHexAndBinFile.js" 
   As soon as the worker is created, the worker script is executed.
   The first thing the worker does is start listening for messages from the main script.
   It does this using addEventListener(), which is a global function in a worker. */
const worker = new Worker('../scripts/IntelHexAndBinFile.js');


let hexFile;

const inputHexfile = document.getElementById("hex2bin-inputHexfile");
inputHexfile.addEventListener("change", selectHexfile);

const addressRanges = document.getElementById("hex2bin-addressRanges");


function resetGUI()
{
   setButtonProgressState(buttonStartConversion, "paused");
   
   inputHexfile.disabled = false;
   inputHexfile.value = "";
}


function selectHexfile()
{
   hexFile = this.files[0];

   if (hexFile)
   {
      buttonStartConversion.disabled = false;
   }
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


   reader.addEventListener("load", () => {
      hexFileContent = reader.result;
      worker.postMessage({
         command: "Hex2Bin",
         hexFileContent: hexFileContent
      })
   });
   reader.readAsText(hexFile);
}


/* When the worker sends a message back to the main thread,
   download the bin file and reset the GUI */
worker.addEventListener("message", message => {
   if (0 != message.data.result)
   {
      alert("ERROR: HEX file is corrupt !!!");
   }
   else
   {
      downloadBinfile(message.data.binFileBlob);
   }
   resetGUI();
});


function downloadBinfile(binFileBlob)
{   
   const link = document.createElement('a');
   link.style.display = 'none';
   const url = URL.createObjectURL(binFileBlob);
   link.href = url;
   link.download = hexFile.name.replace('.hex', '.bin');

   document.body.appendChild(link); /* It needs to be added to the DOM so it can be clicked. */
   link.click();
   document.body.removeChild(link);

   window.URL.revokeObjectURL(url);
}
