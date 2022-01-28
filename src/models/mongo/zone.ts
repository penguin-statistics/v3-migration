import { getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: {
    collection: 'zone',
  },
})
export class MZone {}

export const MZoneModel = getModelForClass(MZone)
