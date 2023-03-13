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

export { hexFilePickerOpts, binFilePickerOpts };