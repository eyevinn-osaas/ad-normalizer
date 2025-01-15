import { Static, Type } from '@sinclair/typebox';

export const ExampleResourceId = Type.String({ description: 'Resource Id' });
export type ExampleResourceId = Static<typeof ExampleResourceId>;

export const ExampleResource = Type.Object({
  resourceId: ExampleResourceId
});
export type ExampleResource = Static<typeof ExampleResource>;
