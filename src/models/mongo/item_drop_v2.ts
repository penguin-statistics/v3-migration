import { getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'item_drop_v2',
  },
})
export class MItemDrop {}

export const MItemDropModel = getModelForClass(MItemDrop)
