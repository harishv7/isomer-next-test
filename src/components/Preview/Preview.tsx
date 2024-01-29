import { RenderEngine } from "@isomerpages/isomer-components";
import defaultSchema from "../../schema/permalink/schema";

export interface PreviewProps {
  schema?: any;
}
export default function Preview({ schema }: PreviewProps) {
  const renderSchema = schema || defaultSchema;
  return (
    <RenderEngine
      id={renderSchema.id}
      layout={renderSchema.layout}
      path={renderSchema.permalink}
      components={renderSchema.components}
    />
  );
}
