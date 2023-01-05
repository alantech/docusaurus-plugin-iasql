import * as Handlebars from "handlebars";

export default function () {
  Handlebars.registerHelper("ifIsTable", function (arg1, options) {
    const str = arg1.name;
    return !str.includes("Rpc") ? options.fn(this) : options.inverse(this);
  });
}
