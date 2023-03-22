/* Listen for messages from the main thread.
   If the message command is e.g. "Hex2Bin", call the function "Hex2Bin". */
addEventListener("message", message => {
   if (message.data.command === 'Hex2Bin') {
      Hex2Bin(message.data.hexFileContent, message.data.addressRanges);
   }
});


const hexFilePattern = /^:(\w{2})(\w{4})(\w{2})(\w*)(\w{2})/;
/*
   ^  : The comparison must start at the beginning of a string or line.
   \w : Matches any word character.
   {2}: Matches the previous element exactly 2 times.
   \w*: Matches any word character zero or more times.
   () : Captures the matched subexpression and assigns it a zero-based ordinal number.
*/


/*
 * --------------------------------------------------------------------
 * Checks if the HEX file content is in RAW hex format or not (Intel HEX format).
 *    @param   HEX file content (string)
 *    @return  Result (true: RAW hex, false: No RAW hex)
 * --------------------------------------------------------------------
 */
function isRawHexFile(hexFileContent)
{
   let retval = false;

   if (hexFileContent.includes(":"))
   {
      retval = false;
   }
   else
   {
      retval = true;
   }

   return retval;
}


/* 
 * --------------------------------------------------------------------
 * Converts a hexadecimal string to a byte array.
 *    @param   Hexadecimal string
 *    @param   OPTIONAL: Length in bytes
 *    @return  Conversion result (true: successful, false: not successful) AND
 *             byte array
 * --------------------------------------------------------------------
 */
function convertHexStringToByteArray(hexString, length)
{
   let result = true;
   let byteArray = [];
   let lengthInBytes;

   if (hexString.length % 2 != 0)
   {
      result = false;
   }

   if (undefined === length)
   {
      lengthInBytes = hexString.length;
   }
   else
   {
      lengthInBytes = length;
   }

   for (let c = 0; (c < lengthInBytes) && (true === result); c += 2)
   {
      byteArray.push(parseInt(hexString.substring(c, c + 2), 16));
      /*
         push:      [array]  adds one element to the end of an array.
         parseInt:  [number] parses a string argument and returns an integer of the specified radix or base.         
         substring: [string] returns the part of the string from the start index up to and excluding the end index.  
      */
   }

   return {
      "result": result,
      "byteArray": byteArray
   };
}


/* 
 * --------------------------------------------------------------------
 * Converts a byte array to a hexadecimal string.
 *    @param   Byte array
 *    @return  Hexadecimal string
 * --------------------------------------------------------------------
 */
function convertByteArrayToHexstring(byteArray)
{
   let hex = [];

   for (let i = 0; i < byteArray.length; i++)
   {
      let current = byteArray[i] < 0 ? byteArray[i] + 256 : byteArray[i];
      hex.push((current >>> 4).toString(16)); /* add the most  significant hex digit of one byte to the hex array */
      hex.push((current & 0xF).toString(16)); /* add the least significant hex digit to one byte to the hex array */
   }

   return hex.join(""); /* returns a new string by concatenating all of the elements in an array, with the ""-separator */
} 


/* 
 * --------------------------------------------------------------------
 * Checks if the start address of the address range(s) is less than or equal to the end address of the address range(s).
 *    @param   Address range(s) string
 *    @return  Result (0: valid, 2: the start address is not less than or equal to end address) AND
 *             array of address ranges
 * --------------------------------------------------------------------
 */
function checkAddressRanges(addressRangesString)
{
   let result = 0;
   let matches;
   let startAddress = 0;
   let endAddress = 0;
   let addressRanges = [];

   const addressRangesPattern = /(?<startAddress>[a-fA-F0-9]{1,8}):(?<endAddress>[a-fA-F0-9]{1,8})/g;
   /*
      ^        : The comparison must start at the beginning of a string or line.
      [a-f0-9] : Matches only hexadecimal digits.
      {1,8}    : Matches the previous element at least once and at most 8 times.
      ?        : Matches the previous element zero or one time.
      +        : Matches the previous element once or more timnes. 
      ()       : Captures the matched subexpression and assigns it a zero-based ordinal number.
      $        : The match must also be at the end of the string.
   */

   /* Match the regular expression pattern against a text string. */
   matches = addressRangesString.matchAll(addressRangesPattern);

      
   for (let match of matches)
   {
      startAddress = Number("0x" + match.groups.startAddress);
      endAddress   = Number("0x" + match.groups.endAddress);
   
      if(startAddress > endAddress)
      {
         result = 2;
      }
      else
      {
         addressRanges.push({startAddress: startAddress, endAddress: endAddress});
      }
   }

   return {
      "result": result,
      "addressRanges": addressRanges
   };
}


/*
 * --------------------------------------------------------------------
 * Converts an Intel/Raw HEX file (.hex-file) to a binary file (.bin-file).
 *    @param   Input HEX file content as string
 *    @param   Address ranges of the .hex file to be converted as string (OPTIONAL).
 *    @return  Message to the main thread with the conversion result (0: success, !=0: error) AND
 *             the bin file as content
 * --------------------------------------------------------------------
 */
function Hex2Bin(hexFileContent, addressRanges) {
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
   let binFileBlob;
   let binFileBlobArray = [];

   let matches = [];

   let recordType = "";


   if (isRawHexFile(hexFileContent))
   {
      for (let i = 0; (i < (hexFileLines.length)) && (hexFileLines[i].length > 0) && (0 === result); i++)
      {
         let lineAsBytesObject = convertHexStringToByteArray(hexFileLines[i]);

         if (false === lineAsBytesObject.result)
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
      if ("" === addressRanges)
      {
         for (let i = 0; (i < (hexFileLines.length)) && (hexFileLines[i].length > 0) && (0 === result); i++)
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

                  if (false === lineAsBytesObject.result)
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

         if (0 === result)
         {
            let byteArray = new Uint8Array(binFileContent);
            binFileBlob = new Blob([byteArray], { type: "application/octet-stream" });
            binFileBlobArray.push(binFileBlob);
         }      
      } /* if ("" === addressRanges) */
      else
      {
         let resultAddressRangesCheck = checkAddressRanges(addressRanges);
         result = resultAddressRangesCheck.result;

         if (0 === result)
         {
            for (let j = 0; (j < resultAddressRangesCheck.addressRanges.length) && (0 === result); j++)
            {
               for (let i = 0; (i < (hexFileLines.length)) && (hexFileLines[i].length > 0) && (0 === result); i++)
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
                        addr = Number("0x"+ matches[2]);
                        absaddr = addr + offset;
                        currAbsaddr = absaddr + (matches[4].length / 2) - 1;
   
                        if (   ( (absaddr >= resultAddressRangesCheck.addressRanges[j].startAddress) || (currAbsaddr >= resultAddressRangesCheck.addressRanges[j].startAddress) ) 
                            &&   (absaddr <= resultAddressRangesCheck.addressRanges[j].endAddress)
                           )
                        {
                           /* Start address is not at the beginning of a line */
                           if ((absaddr < resultAddressRangesCheck.addressRanges[j].startAddress) && (currAbsaddr >= resultAddressRangesCheck.addressRanges[j].startAddress))
                           {
                               startIndex = (resultAddressRangesCheck.addressRanges[j].startAddress - absaddr) * 2;
                           }
                           else
                           {
                               startIndex = 0;
                           }
      
                           /* End address is not at the end of a line */
                           if (currAbsaddr > resultAddressRangesCheck.addressRanges[j].endAddress)
                           {
                               endIndex = (resultAddressRangesCheck.addressRanges[j].endAddress - absaddr) * 2 + 1 ;
                           }
                           else
                           {
                               endIndex = matches[4].length - 1;
                           }
                           
                           let lineAsBytesObject = convertHexStringToByteArray(matches[4].substring(startIndex, endIndex + 1));
         
                           if (false === lineAsBytesObject.result)
                           {
                              result = 1;
                           }
                           else
                           {
                              binFileContent.push(...lineAsBytesObject.byteArray);
                           }
                        }
                        else
                        {
                        }
                     }
                     /* Extended Segment Address Record */
                     else if ("02" == recordType)
                     {
                        addr = Number("0x" + matches[4]);
                        offset = (addr << 4);
                     }
                     /* Extended Linear Address Record */
                     else if ("04" == recordType)
                     {
                        addr = Number("0x" + matches[4]);
                        offset = (addr << 16);
                     }
                  }
                  else
                  {
                     result = 1;
                  }
               }

               if (0 === result)
               {
                  let byteArray = new Uint8Array(binFileContent);
                  binFileBlob = new Blob([byteArray], { type: "application/octet-stream" });
                  binFileBlobArray.push(binFileBlob);
                  
                  binFileContent.length = 0; /* Empties/clears the array */
               }            
            }   
         } /* address ranges check passed */
      } /* else: ("" === addressRanges) */
   } /* else: isRawHexFile(hexFileContent) */

   const returnObject = {
      result: result,
      binFileBlobArray: binFileBlobArray
   }

   /* When finished, send a message to the main thread, including the "binFileBlobArray".
      The main script is listening for this message and will update the DOM when the message is received. */
   postMessage(returnObject);
}