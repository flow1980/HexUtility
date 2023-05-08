let updateManifestJsoneditor = {
   theme: "bulma",
   iconlib: "spectre",
   /* compact: true, */
   /* array_controls_top: true, */
   disable_array_delete_all_rows: true,
   disable_array_delete_last_row: true,
   disable_array_reorder: true,
   disable_collapse: true,
   disable_edit_json: true,
   disable_properties: true,
   prompt_before_delete: false,
   schema: {
      title: " ",
      type: "object",
      properties: {
         manifestVersion: {
            title: "Manifest version",
            type: "string",
            "options": {
               "input_width": "300px",
               "inputAttributes": {
                  "placeholder":  "e.g.: 3.0.0.0",
               },
            },
            required: true
         },
         executionOrder: {
            title: "Execution order",
            type: "string",
            "options": {
               "inputAttributes": {
                  "placeholder":  "e.g.: ESP, SCU",
               },
            },
            required: true
         },
         dependencies: {
            title: "Dependencies",
            type: "string",
            "options": {
               "inputAttributes": {
                  "placeholder":  "e.g.: ESP, SCU",
               },
            },
         required: true
         },
         prePostActionsFile: {
            title: "Pre Post Actions .lua file",
            type: "string",
            "options": {
               "inputAttributes": {
                  "placeholder":  "e.g.: cfg_Vehicle_PrePostActions.lua",
               },
            },
            required: true
         },
         "ECUs": {
            type: "array",
            title: " ",
            format: "tabs",
            "maxItems": 10,
            "minItems": 1,
            items:
            {
               title: "Add ECU",
               "headerTemplate": "{{ i1 }}_{{ self.ecuName }} ",
               type: "object",
               properties: {
                  ecuName: {
                     title: "ECU name",
                     type: "string",
                     "options": {
                        "inputAttributes": {
                           "placeholder":  "e.g.: ESP_Enh",
                        },
                     },
                     required: true
                  },
                  ecuUpdateScript: {
                     title: "ECU update script name (.lua file)",
                     type: "string",
                     "options": {
                        "inputAttributes": {
                           "placeholder":  "e.g.: cfg_ESP_OtaEnh_FLA.lua",
                        },
                     },
                     required: true
                  },
                  ecuPrePostAct: {
                     title: "ECU Pre Post actions file name (.lua file) [OPTIONAL]",
                     type: "string",
                  },
                  updateControlTable: {
                     title: "Filename of the update control table (.bin file)",
                     type: "string",
                     "options": {
                        "inputAttributes": {
                           "placeholder":  "e.g.: ESP_updateControlTable.bin",
                        },
                     },
                     required: true
                  }
               }
            }
         }
      }
   }
}


export { updateManifestJsoneditor };