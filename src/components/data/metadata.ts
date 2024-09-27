
import { faker } from '@faker-js/faker'
import { createRandomUser } from './user'
export const createRandomItemMetadata = (user?: any): any => {
  const userData = user || createRandomUser()
  const itemModified = faker.datatype.boolean()

  if (itemModified) {
    return {
      ItemCreated: faker.date.past().toISOString(),
      ItemCreatedById: userData.Id
    }
  } else {
    return {
      ItemCreated: faker.date.past().toISOString(),
      ItemModified: faker.date.recent().toISOString(),
      ItemCreatedById: userData.Id,
      ItemModifiedById: userData.Id
    }
  }
}
