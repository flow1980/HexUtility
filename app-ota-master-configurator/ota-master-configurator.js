import { updateManifestJsoneditor } from "./update-manifest-jsoneditor.js";

const element = document.getElementById("json-editor");
const editor = new JSONEditor(element, updateManifestJsoneditor);
