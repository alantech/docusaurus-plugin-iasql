import * as Handlebars from "handlebars";
import { ReferenceReflection } from "typedoc";

export default function () {
  Handlebars.registerHelper(
    "referenceMember",
    function (this: ReferenceReflection) {
      return "";
    }
  );
}
