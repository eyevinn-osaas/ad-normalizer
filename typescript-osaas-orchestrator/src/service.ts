import { V1Pod } from '@kubernetes/client-node';
import {
  Instances,
  InstanceParamsToAnnotationsFunction,
  InstanceParamsToEnvVarFunction,
  PodDataToInstanceFunction,
  generateDnsName
} from '@osaas/orchestrator';
import { Static, Type } from '@sinclair/typebox';

export const ANNOTATION_URL = `${process.env.SERVICE_NAME}.osaas.eyevinn.se/url`;

export const TInstanceName = Type.String({
  description: 'Name of the service instance'
});
export type TInstanceName = Static<typeof TInstanceName>;

export const TInstance = Type.Object({
  name: TInstanceName,
  url: Type.String({ description: 'URL to instance API' })
});
export type TInstance = Static<typeof TInstance>;

export const NewTInstance = Type.Object({
  name: Type.String({ description: 'Name of the instance' })
});
export type NewTInstance = Static<typeof NewTInstance>;
export const TInstanceArray = Type.Array(TInstance);
export type TInstanceArray = Static<typeof TInstanceArray>;

export const podDataToInstanceFunction: PodDataToInstanceFunction<
  TInstance
> = (podData: V1Pod, serviceTypeId: string, environment: string) => {
  return {
    name: podData.metadata?.labels?.[Instances.Labels.INSTANCE_NAME] || ''
  };
};

export const instanceParamsToAnnotationsFunction: InstanceParamsToAnnotationsFunction<
  NewTInstance
> = (
  parameters: NewTInstance,
  serviceTypeId: string,
  appName: string,
  environment: string
) => {
  return {
    [ANNOTATION_URL]: generateDnsName(serviceTypeId, appName, environment)
  };
};

export const instanceParamsToEnvVarFunction: InstanceParamsToEnvVarFunction<
  NewTInstance
> = (parameters: NewTInstance) => {
  return [
    {
      name: 'PORT',
      value: '8080'
    }
  ];
};
