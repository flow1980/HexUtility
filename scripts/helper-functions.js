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


/* 
 * --------------------------------------------------------------------
 * Sets the progress bar of a button.
 *    @param   Button element
 *    @param   State (running, paused) of the progress bar
 *    @return  hexadecimal string
 * --------------------------------------------------------------------
 */
function setButtonProgressState(button, playState) {
   const elementButtonProgress = button.querySelector(".buttonProgress");

   elementButtonProgress.style.animationPlayState = `${playState}`

   if ("paused" === playState)
   {
      elementButtonProgress.style.animation = "none";
      elementButtonProgress.offsetHeight; /* trigger reflow */
      elementButtonProgress.style.animation = null;

      button.disabled = true;
   }
}



export { hexFilePickerOpts, binFilePickerOpts, setButtonProgressState };