import * as Handlebars from "handlebars";

export default function () {
  Handlebars.registerHelper("ifIsEqual", function (arg1, arg2, options) {
    return arg1 == arg2 ? options.fn(this) : options.inverse(this);
  });
}
