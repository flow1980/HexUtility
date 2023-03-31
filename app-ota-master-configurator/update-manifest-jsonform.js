let updateManifestJsonform = {
   schema: {
      /* Object that describes the data model */

      updateManifest:
      {
         type: "object",
         title: "Update Manifest",
         properties: 
         {
            manifestVersion: { type: "string", title: "Manifest version:", required: true },
            executionOrder: { type: "string", title: "Execution order:", required: true },
            dependencies: { type: "string", title: "Dependencies:", required: true },
            prePostActionsFile: { type: "string", title: "Pre Post Actions .lua file:", required: true },
            ecu:
            {
               type: "array",
               items: 
               {
                  type: "object",
                  title: "ECU",
                  properties: {
                     ecuName: { type: "string", title: "ECU name:", required: true },
                     ecuUpdateScript: { type: "string", title: "ECU update script name (.lua file):", placeholder: "e.g.: cfg_ESP_OtaEnh_FLA.lua", required: true },
                     ecuPrePostAct: { type: "string", title: "ECU Pre Post actions file name (.lua file) [OPTIONAL]:", required: false },
                     updateControlTable: { type: "string", title: "Filename of the update control table (.bin file):", placeholder: "e.g.: ESP_updateControlTable.bin", required: true }
                  }
               }
            }
         } 
      }
   },

   form: [
      /* Array that describes the layout of the form */
//      "*", /* produces a form that contains all properties defined in the schema */
       
      {
         key: "updateManifest.manifestVersion",
         placeholder: "e.g.: 3.0.0.0",
         fieldHtmlClass: "jsonform-input-size",
      },
      {
         key: "updateManifest.executionOrder",
         placeholder: "e.g.: ESP, SCU"
      },
      {
         key: "updateManifest.dependencies",
         placeholder: "e.g.: ESP, SCU"
      },
      {
         key: "updateManifest.prePostActionsFile",
         placeholder: "e.g.: cfg_Vehicle_PrePostActions.lua"
      },
      {
         type: "tabarray",
         items:
         {
            type: "fieldset",            
            legend: "ECU{{idx}}",
            items:
            [
               { key: "updateManifest.ecu[].ecuName", placeholder: "e.g.: ESP_Enh" },
               { key: "updateManifest.ecu[].ecuUpdateScript", placeholder: "e.g.: cfg_ESP_OtaEnh_FLA.lua" },
               { key: "updateManifest.ecu[].ecuPrePostAct", placeholder: "" },
               { key: "updateManifest.ecu[].updateControlTable", placeholder: "e.g.: ESP_updateControlTable.bin" },
            ]
         }
      },

      {
         type: "submit",
         title: "Generate the update manifest file"
      },
   ],

   params:
   {
      fieldHtmlClass: "jsonform-input-size"
   },

   displayErrors: function (errors, formElt)
   {
      for (var i=0; i<errors.length; i++) {
        errors[i].message = "Please fill out this field!";
      }
      $(formElt).jsonFormErrors(errors, formObject);
   },

   onSubmit: function (errors, values)
   {
      if (errors)
      {
        alert('Check the form for invalid values!');
        return;
      }
      // "values" follows the schema, yeepee!
      console.log(values);
   },
    
    onSubmitValid: function (values) {
      /* Callback function called upon form submission when values are valid */
      console.log(values);
   }

};


export { updateManifestJsonform };