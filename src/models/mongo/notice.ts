import { getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'notice',
  },
})
export class MNotice {}

export const MNoticeModel = getModelForClass(MNotice)
