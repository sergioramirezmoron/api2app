export type Field = {
  name: string;
  label: string;
};

export type Endpoint = {
  name: string;
  path: string;
  method: string;
  fields: Field[];
};

export type SchemaLike = {
  type?: string;
  items?: SchemaLike;
  properties?: Record<string, unknown>;
};

export type JsonContentLike = {
  schema?: SchemaLike;
};

export type ResponseLike = {
  content?: {
    "application/json"?: JsonContentLike;
  };
};

export type OperationLike = {
  responses?: Record<string, ResponseLike>;
};

export type OpenApiLike = {
  paths?: Record<string, Record<string, unknown>>;
};
