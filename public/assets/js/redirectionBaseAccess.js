/* eslint-disable no-undef */
document
  .addEventListener('DOMContentLoaded',
    async function () {
      const redirectionURL = window.location.href
      const groups = await $pnp.sp.web.getUserById(_spPageContextInfo.userId).groups.get()
      const groupnames = Array.from(new Set(groups?.map((v) => v.Title)))
      if ((!_spPageContextInfo.isSiteAdmin && !groupnames.some(r => FullControlUserGroups.includes(r))) && (redirectionURL.indexOf('_layouts/') > -1 || redirectionURL.indexOf('Lists/') > -1 || redirectionURL.indexOf('lists/') > -1 || redirectionURL.indexOf('forms/') > -1)) {
        window.location.href = _spPageContextInfo.webAbsoluteUrl + '/SitePages/Home.aspx#/accessdenied'
      }
    })
