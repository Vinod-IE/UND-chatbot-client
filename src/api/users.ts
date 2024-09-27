/* eslint-disable camelcase */
import { sp } from '@pnp/sp'
import '@pnp/sp/webs'
import '@pnp/sp/site-groups'
import '@pnp/sp/site-groups/web'
import { GENERAL_USER_GROUP } from '../configuration'
import { ISiteUserProps } from '@pnp/sp/site-users'
export const getGroups = async () => {
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: window._spPageContextInfo.__siteAbsoluteUrl
    }
  })
  const groups = await sp.web.siteGroups()
  return groups
}
export const getGroupID = async (GroupName: string) => {
  const grp = await sp.web.siteGroups.getByName(GroupName)()
  return grp.Id
}
export const getUsersfromRole = async (groupName : string) => {
  const groupID = getGroupID(groupName)
  const groupUsers = await sp.web.siteGroups.getById(await groupID).users()
  return groupUsers
}

export const getUsersRoles = async (user : string) => {
  try {
    const groups = await sp.web.siteUsers.getByLoginName(user).groups.get()
    return groups
  } catch (err) {
    try {
      await addUserToRole(GENERAL_USER_GROUP, user).then(function (data) {
        removeUserFromRole(GENERAL_USER_GROUP, user).then(() => {
          getUsersRoles(user)
        })
      })
    } catch (e) {
      console.log(e)
    }
  }
}
export const removeUserFromRole = async (selectedRole: string, selectedUser : string) => {
  await sp.web.siteGroups.getByName(selectedRole).users.removeByLoginName(selectedUser)
}
export const addUserToRole = async (selectedRole: string, selectedUser : string) => {
  return await sp.web.siteGroups.getByName(selectedRole).users.add(selectedUser)
}
export async function getCustomerID (mail: string, Key: string) {
  let customerIdval: ISiteUserProps | string
  if (mail !== undefined && mail !== '[]') {
    try {
      const checkuser = await sp.web.ensureUser(mail)
      console.log(checkuser)
      customerIdval = checkuser.data
    } catch (SPException) {
      customerIdval = ''
    }
    if (customerIdval === '' || customerIdval === undefined) {
      await (await sp.web.siteGroups.getByName('All Users').users.add(Key))().then(function (data) {
        customerIdval = data
        sp.web.siteGroups.getByName('All Users').users.removeByLoginName(Key).then(() => {
          console.log('added and removed')
        })
      })
    }
  } else {
    customerIdval = ''
  }
  return customerIdval
}
