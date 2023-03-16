const hexFilePickerOpts = {
   types: [
      {
         description: "HEX file",
         accept: {
            "text/*": [".hex"]
         }
      },
   ],
   excludeAcceptAllOption: true,
   multiple: false
};

const binFilePickerOpts = {
   types: [
      {
         description: 'BIN file',
         accept: '.bin'
      },
   ],
   excludeAcceptAllOption: true,
   multiple: false
};

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
 *    @return  Result (true: Hex digit, false: No Hex Digit)
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
 *    @return  Conversion result (true: successful, false: not successful) AND
 *             byte array
 * --------------------------------------------------------------------
 */
function convertHexStringToByteArray(hexString)
{
   let result = true;
   let byteArray = [];

   if (hexString.length % 2 != 0)
   {
      result = false;
      alert("The binary key cannot have an odd number of digits: $(hexString)");
   }
 
   for (let c = 0; (c < hexString.length) && (true === result); c += 2)
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
 *    @return  hexadecimal string
 * --------------------------------------------------------------------
 */
function convertByteArrayToHexstring (byteArray)
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


export { hexFilePickerOpts, binFilePickerOpts, hexFilePattern, isRawHexFile, convertHexStringToByteArray, convertByteArrayToHexstring };