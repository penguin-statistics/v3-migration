import { getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'user',
  },
})
export class MUser {}

export const MUserModel = getModelForClass(MUser)
