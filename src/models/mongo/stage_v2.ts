import { getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'stage_v2',
  },
})
export class MStage {}

export const MStageModel = getModelForClass(MStage)
