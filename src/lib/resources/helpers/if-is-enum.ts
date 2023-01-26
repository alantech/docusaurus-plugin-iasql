import * as Handlebars from "handlebars";

export default function () {
  Handlebars.registerHelper("ifIsEnum", function (arg1, options) {
    return arg1.kindString == "Enumeration"
      ? options.fn(this)
      : options.inverse(this);
  });
}
