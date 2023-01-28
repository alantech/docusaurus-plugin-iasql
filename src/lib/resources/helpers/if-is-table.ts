import * as Handlebars from "handlebars";

export default function () {
  Handlebars.registerHelper("ifIsTable", function (arg1, options) {
    const str = arg1.name.toLowerCase();
    return !str.includes("rpc") &&
      !str.startsWith("iasql") &&
      arg1.kindString == "Class"
      ? options.fn(this)
      : options.inverse(this);
  });
}
