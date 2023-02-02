import * as Handlebars from "handlebars";

export default function () {
  Handlebars.registerHelper("ifIsModule", function (arg1, options) {
    return arg1.kindString == "Module"
      ? options.fn(this)
      : options.inverse(this);
  });
}
