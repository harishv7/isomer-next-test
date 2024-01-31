import { RenderEngine } from "@isomerpages/isomer-components";
import { schema } from "@/schema//collection/some-link-page/schema";

export default function Preview() {
  const renderSchema = schema;
  return (
    <RenderEngine
      id={renderSchema.id}
      layout={renderSchema.layout}
      path={renderSchema.permalink}
      components={renderSchema.components}
    />
  );
}