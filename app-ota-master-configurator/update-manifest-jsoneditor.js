let updateManifestJsoneditor = {
   theme: "bulma",
   iconlib: "spectre",
   compact: true,
   disable_array_delete_all_rows: true,
   disable_array_delete_last_row: true,
   disable_array_reorder: true,
   disable_collapse: true,
   disable_edit_json: true,
   disable_properties: true,
   prompt_before_delete: false,
   schema: {
      title: " ",
      $ref: "#/definitions/updateManifest",
      definitions: {
         updateManifest: {
            type: "object",
            id: "updateManifest",
            // The object will start with only these properties
            defaultProperties: [
               "manifestVersion",
               "executionOrder",
               "dependencies",
               "prePostActionsFile",
               "ecu"
            ],
            properties: {
               manifestVersion: {
                  title: "Manifest version",
                  type: "string",
                  "options": {
//                     "input_width": "300px",
                     "inputAttributes": {
                        "placeholder":  "e.g.: 3.0.0.0",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               },
               executionOrder: {
                  title: "Execution order",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: ESP, SCU",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               },
               dependencies: {
                  title: "Dependencies",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: ESP, SCU",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
               required: true
               },
               prePostActionsFile: {
                  title: "Pre Post Actions .lua file",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: cfg_Vehicle_PrePostActions.lua",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               },
               ecu: {
                  type: "array",
                  title: " ",
                  format: "tabs",
                  uniqueItems: true,
                  items: {
                     title: "ECU",
                     $ref: "#/definitions/ecu"
                   },
                   required: true
               }
            }
         },
         ecu: {
            type: "object",
//            id: "ecu",
            // The object will start with only these properties
            defaultProperties: [
               "ecuName",
               "ecuUpdateScript",
               "ecuPrePostAct",
               "updateControlTable"
            ],
            properties: {
               ecuName: {
                  title: "ECU name",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: ESP_Enh",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               },
               ecuUpdateScript: {
                  title: "ECU update script name (.lua file)",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: cfg_ESP_OtaEnh_FLA.lua",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               },
               ecuPrePostAct: {
                  title: "ECU Pre Post actions file name (.lua file) [OPTIONAL]",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  }
               },
               updateControlTable: {
                  title: "Filename of the update control table (.bin file)",
                  type: "string",
                  "options": {
                     "inputAttributes": {
                        "placeholder":  "e.g.: ESP_updateControlTable.bin",
                        "class": "input is-small",
                     },
                     "containerAttributes": {
                        "class": "container label is-small",
                     }
                  },
                  required: true
               }
            },
            //format: "categories",
         }
      }
   }
};


export { updateManifestJsoneditor };