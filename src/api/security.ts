/* eslint-disable camelcase */
import { SPHttpClient, sp } from '@pnp/sp'
import { IRoleDefinitionInfo } from '@pnp/sp/security'
import '@pnp/sp/fields'
import '@pnp/sp/items'
import '@pnp/sp/lists'
import '@pnp/sp/views'
import '@pnp/sp/webs'
import '@pnp/sp/fields/web'
import '@pnp/sp/site-groups/web'
import { loadPageContext } from 'sp-rest-proxy/dist/utils/env'
import { I_SharePointPersonOrGroup } from '../shared/interfaces/SharePoint.interface'
import { SHAREPOINT_PERMISSION_LEVELS, SHAREPOINT_PERMISSION_LEVELS_IDS } from '../configuration'
import { ISiteGroupInfo, _SiteGroup } from '@pnp/sp/site-groups/types'
import { delay, getSiteRelativeURLFromPageContext, getSiteURLFromPageContext } from '../shared/utility'

export const getOwnerGroup = async (): Promise<ISiteGroupInfo | Error> => {
  let groupOwner: ISiteGroupInfo
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  // eslint-disable-next-line prefer-const
  groupOwner = await sp.web.associatedOwnerGroup()
  return groupOwner
}

export const getSecurityGroupOwner = async (siteGroupId: number): Promise<ISiteGroupInfo | I_SharePointPersonOrGroup | null> => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const client = new SPHttpClient()
  try {
    const endpointUrl = getSiteRelativeURLFromPageContext(pageContext) + `/_api/Web/SiteGroups/GetById(${siteGroupId})/Owner`
    try {
      const response = await client.get(endpointUrl)
      if (!response.ok) {
        console.log('Error setting security group permissions')
        return null
      }
      const data = await response.json()
      const owner: ISiteGroupInfo | I_SharePointPersonOrGroup | null = data.d
      return owner
    } catch (error) {
      console.error('Error setting security group permissions:', error)
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getAllSecurityGroups = async (): Promise<Array<ISiteGroupInfo> | null> => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  try {
    const groups = await sp.web.siteGroups.expand('RoleAssignments/RoleDefinitionBindings').get()
    return groups
  } catch (error) {
    console.error('Error fetching security groups:', error)
    return null
  }
}

export const addUsersToSecurityGroup = async (groupName: string, users: Array<I_SharePointPersonOrGroup>) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const group = await getSiteGroupByName(groupName)
  if (!group) {
    console.error('Error fetching security group:', groupName)
    return
  }
  for (const user of users) {
    await sp.web.siteGroups.getById(group.Id).users.add(user.LoginName)
  }
}

export const removeUsersFromSecurityGroup = async (groupName: string, users: Array<I_SharePointPersonOrGroup>) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const group = await getSiteGroupByName(groupName)
  if (!group) {
    console.error('Error fetching security group:', groupName)
    return
  }
  for (const user of users) {
    if (sp.web.siteGroups.getById(group.Id).users.getById(user.Id) === null) continue
    await sp.web.siteGroups.getById(group.Id).users.removeByLoginName(user.LoginName)
  }
}

export const getUserSiteGroups = async (userId: number) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const client = new SPHttpClient()
  const endpointUrl = getSiteRelativeURLFromPageContext(pageContext) + `/_api/web/siteusers/getById(${userId})/groups`
  try {
    const response = await client.get(endpointUrl)
    if (!response.ok) {
      console.log('Error getting user security groups')
      return
    }
    const resultJSON = await response.json()
    const groups = resultJSON.d.results
    return groups
  } catch (error) {
    console.error('Error fetching security groups:', error)
    throw error
  }
}

// Get the sitegroup by its name
export const getSiteGroupByName = async (groupName: string): Promise<ISiteGroupInfo | null> => {
  try {
    // Get the group by name
    const groupResult = await sp.web.siteGroups.getByName(groupName)
    if (groupResult) {
      const group: ISiteGroupInfo = await groupResult.get()
      return group
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

// Get the ID of a group by its name
export const getSiteGroupIdByName = async (groupName: string): Promise<number> => {
  try {
    // Get the group by name
    const group: ISiteGroupInfo = await sp.web.siteGroups.getByName(groupName).get()
    return group.Id
  } catch (error) {
    console.error(`Error getting group '${groupName}':`, error)
    throw error
  }
}

export const setSiteGroupGroupOwner = async (groupId: number, ownerGroupId: number) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const siteId = await sp.site.select('Id').get()
  const body = `
    <Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName=".NET Library" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009">
        <Actions>
            <SetProperty Id="1" ObjectPathId="2" Name="Owner">
                <Parameter ObjectPathId="3" />
            </SetProperty>
            <Method Name="Update" Id="4" ObjectPathId="2" />
        </Actions>
        <ObjectPaths>
            <!--siteId:g:groupId SPO Group to update-->
            <Identity Id="2" Name="740c6a0b-85e2-48a0-a494-e0f1759d4aa7:site:${siteId.Id}:g:${groupId}" />
            <!--siteId:g:groupId Owner Group-->
            <Identity Id="3" Name="740c6a0b-85e2-48a0-a494-e0f1759d4aa7:site:${siteId.Id}:g:${ownerGroupId}" />
        </ObjectPaths>
    </Request>
    `
  const client = new SPHttpClient()
  const endpointUrl = getSiteRelativeURLFromPageContext(pageContext) + '/_vti_bin/client.svc/ProcessQuery'
  try {
    const response = await (await client.post(endpointUrl, {
      headers: {
        'Content-Type': 'text/xml'
      },
      body: body
    }))
    if (!response.ok) {
      console.log('Error setting security group owner')
      return
    }
  } catch (error) {
    console.error('Error setting security group owner:', error)
    throw error
  }
}

export const setSiteGroupUserOwner = async (group: any, ownerID: number) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo

  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  try {
    // get the site group by name
    const siteGroup: ISiteGroupInfo | null = await getSiteGroupByName(group.SecurityGroupTitle)
    if (!siteGroup) return
    // Update the owner with a user id
    await sp.web.siteGroups.getById(siteGroup.Id).setUserAsOwner(ownerID)
  } catch (error) {
    console.error('Error adding owner to group:', error)
    throw error
  }
}

export const addSiteGroup = async (group: any) => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  try {
    const result = await sp.web.siteGroups.add({
      Title: group.SecurityGroupTitle,
      Description: group.Description,
      AllowMembersEditMembership: group.EditMembership,
      OnlyAllowMembersViewMembership: group.ViewMembership
    })
    return result
  } catch (error) {
    console.error('Error adding site group:', error)
    throw error
  }
}

export const createBusinessOwnerGroupFromExcelData = async (businessOwnerGroup: any, user: I_SharePointPersonOrGroup, overwriteGroups: boolean) => {
  // get site collection owner
  const ownerGroup: ISiteGroupInfo | Error | null = await getOwnerGroup()
  if (!(ownerGroup)) return
  if (ownerGroup instanceof Error) return
  try {
    const businessOwnerSecurityGroup: any = {
      SecurityGroupTitle: businessOwnerGroup.Title ?? '',
      Description: businessOwnerGroup.Description ?? '',
      PermissionLevels: {
        results: businessOwnerGroup.PermissionLevels ?? []
      },
      ViewMembership: businessOwnerGroup.ViewMembership ?? false,
      EditMembership: businessOwnerGroup.EditMembership ?? false,
      GroupOwnersId: ownerGroup.Id,
      IsArchived: false,
      ItemCreatedById: 0,
      ItemCreated: (new Date()).toISOString()
    }
    let groupID = 0
    // delete group if it already exists, create site group, and update group owner
    const existingGroup: ISiteGroupInfo | null = await getSiteGroupByName(businessOwnerSecurityGroup.SecurityGroupTitle)
    if (existingGroup && overwriteGroups) {
      // remove group
      await sp.web.siteGroups.removeById(existingGroup.Id)
    }
    if ((existingGroup && overwriteGroups) || (existingGroup === null)) {
      // create site group
      const groupResult = await addSiteGroup(businessOwnerSecurityGroup)
      groupID = groupResult.data.Id
      await delay(1000)
      // update group owner for business owner groups
      await setSiteGroupGroupOwner(groupID, ownerGroup.Id)
      await delay(1000)
    }
    // get group id
    groupID = await getSiteGroupIdByName(businessOwnerSecurityGroup.SecurityGroupTitle)
    // add permissions to group ()
    await setPermissionsForGroup(businessOwnerSecurityGroup, groupID)
  } catch (error) {
    console.error('Error creating business owner groups:', error)
    throw error
  }
}

export const createOtherSecurityGroupsFromExcelData = async (businessOwnerGroup: any, groups: any, user: I_SharePointPersonOrGroup, overwriteGroups: boolean) => {
  for (const group of groups) {
    try {
      if (!group.GroupOwners) return
      // get group owner
      const groupOwner: ISiteGroupInfo | null = await getSiteGroupByName(group.GroupOwners)
      if (!groupOwner) return
      // create security group object
      const securityGroup: any = {
        SecurityGroupTitle: group.Title ?? '',
        Description: group.Description ?? '',
        PermissionLevels: {
          results: group.PermissionLevels ?? []
        },
        ViewMembership: group.ViewMembership ?? false,
        EditMembership: group.EditMembership ?? false,
        GroupOwnersId: groupOwner.Id,
        IsArchived: false,
        ItemCreatedById: 0,
        ItemCreated: (new Date()).toISOString()
      }
      let groupID = 0
      // delete group if it already exists
      const existingGroup: ISiteGroupInfo | null = await getSiteGroupByName(securityGroup.SecurityGroupTitle)
      // delete group if it already exists, create site group, and update group owner
      if (existingGroup && overwriteGroups) {
        // remove group
        await sp.web.siteGroups.removeById(existingGroup.Id)
      }
      if ((existingGroup && overwriteGroups) || (existingGroup === null)) {
        // create site group
        const groupResult = await addSiteGroup(securityGroup)
        groupID = groupResult.data.Id
        await delay(1000)
        // update group owner for business owner groups
        await setSiteGroupGroupOwner(groupID, groupOwner.Id)
        await delay(1000)
      }
      // get group id
      groupID = await getSiteGroupIdByName(securityGroup.SecurityGroupTitle)
      // add permissions to group ()
      await setPermissionsForGroup(securityGroup, groupID)
    } catch (error) {
      console.error('Error creating business owner groups:', error)
      throw error
    }
  }
}

export const getPermissionsByUserOrGroupId = async (id: number): Promise<Array<IRoleDefinitionInfo> | null> => {
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const client = new SPHttpClient()
  try {
    const endpointUrl = getSiteRelativeURLFromPageContext(pageContext) + `/_api/Web/RoleAssignments/GetByPrincipalId(${id})/RoleDefinitionBindings`
    try {
      const response = await client.get(endpointUrl)
      if (!response.ok) {
        console.log('Error getting security group permissions')
        return null
      }
      const data = await response.json()
      const roleDefinition: Array<IRoleDefinitionInfo> = data.d.results
      return roleDefinition
    } catch (error) {
      console.error('Error setting security group permissions:', error)
      return null
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

// Add the new role assignment for the group on the list.
export const setPermissionsForGroup = async (group: any, groupId: number) => {
  // Define the permission level (role definition) to add
  const targetRoleDefinitionIds: Array<number> = []
  for (const permission of group.PermissionLevels.results) {
    switch (permission) {
      case SHAREPOINT_PERMISSION_LEVELS.Contribute.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.Contribute)
        break
      case SHAREPOINT_PERMISSION_LEVELS.FullControl.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.FullControl)
        break
      case SHAREPOINT_PERMISSION_LEVELS.Design.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.Design)
        break
      case SHAREPOINT_PERMISSION_LEVELS.Edit.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.Edit)
        break
      case SHAREPOINT_PERMISSION_LEVELS.Read.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.Read)
        break
      case SHAREPOINT_PERMISSION_LEVELS.ViewOnly.toString():
        targetRoleDefinitionIds.push(SHAREPOINT_PERMISSION_LEVELS_IDS.ViewOnly)
        break
      default:
        // TODO: Handle unknown permission level
        break
    }
  }
  // loadPageContext - gets correct URL in localhost and SP environments
  await loadPageContext()
  // `_spPageContextInfo` will contain correct information in both localhost and SP environments
  const pageContext: any = (window as any)._spPageContextInfo
  sp.setup({
    sp: {
      headers: {
        Accept: 'application/json;odata=verbose'
      },
      baseUrl: getSiteURLFromPageContext(pageContext)
    }
  })
  const client = new SPHttpClient()
  try {
    for (const permissionId of targetRoleDefinitionIds) {
      const endpointUrl = pageContext.webServerRelativeUrl + '/_api/web/roleassignments/addroleassignment(principalid=' + groupId + ', roledefid=' + permissionId.toString() + ')'
      try {
        const response = await client.post(endpointUrl)
        if (!response.ok) {
          console.log('Error setting security group permissions')
          return
        }
      } catch (error) {
        console.error('Error setting security group permissions:', error)
        throw error
      }
    }
  } catch (error) {
    console.log(error)
  }
}
