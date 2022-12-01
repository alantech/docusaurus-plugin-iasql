import * as Handlebars from "handlebars";
import { ContainerReflection, ReflectionKind } from "typedoc";
import { PageEvent } from "typedoc/dist/lib/output/events";
import { camelToSnakeCase } from "../../utils";

export default function () {
  Handlebars.registerHelper(
    "reflectionPath",

    function (this: PageEvent<ContainerReflection>) {
      if (this.model) {
        if (this.model.kind && this.model.kind !== ReflectionKind.Module) {
          const title: string[] = [];
          if (this.model.parent && this.model.parent.parent) {
            if (this.model.parent.parent.parent) {
              title.push(`${camelToSnakeCase(this.model.parent.parent.name)}`);
            }
            title.push(`${camelToSnakeCase(this.model.parent.name)}`);
          }
          title.push(camelToSnakeCase(this.model.name));
          return title.length > 1 ? `${title.join(".")}` : null;
        }
      }
      return null;
    }
  );
}
