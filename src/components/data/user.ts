
import { faker } from '@faker-js/faker'
import { ISiteUserInfo } from '@pnp/sp/site-users/types'
// eslint-disable-next-line camelcase
import { sp_PrincipalType } from './data.types'
export const createRandomUser = (): ISiteUserInfo => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    Id: faker.number.int({ min: 1, max: 100 }),
    UserId: {
      NameId: faker.string.uuid(),
      NameIdIssuer: faker.internet.url()
    },
    UserPrincipalName: faker.internet.email({ firstName: firstName, lastName: lastName }),
    IsHiddenInUI: false,
    IsShareByEmailGuestUser: false,
    IsSiteAdmin: false,
    Email: faker.internet.email({ firstName: firstName, lastName: lastName }),
    LoginName: faker.internet.userName({ firstName: firstName, lastName: lastName }),
    Title: firstName + ' ' + lastName,
    IsEmailAuthenticationGuestUser: faker.datatype.boolean(),
    PrincipalType: sp_PrincipalType.User,
    Expiration: faker.date.future().toLocaleDateString()
  }
}
