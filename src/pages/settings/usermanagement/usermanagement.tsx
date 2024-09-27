/* eslint-disable multiline-ternary */
import React, { useEffect, useState, useRef, useContext } from 'react'
import ActionButtons from '../../../components/buttons/actionbutton'
import Buttons from '../../../components/buttons/buttons'
import SpPeoplePicker from 'react-sp-people-picker'
import InputCheck from '../../../utils/controls/input-checkbox'
import { addUserToRole, getUsersRoles, getUsersfromRole, removeUserFromRole } from '../../../api/users'
import { ISiteUserInfo } from '@pnp/sp/site-users/types'
import { USER_ROLES } from '../../../configuration'
import CustomSelect from '../../../utils/controls/custom-select'
import $ from 'jquery'
import Tooltip from '../../../components/tooltip/tooltips'
import { PopupCloseContext, UserInitalValue } from '../../../shared/contexts/popupclose-context'
let popupTop: number
let xpositionvalue: number
let offsetLeftValue: number
let offsetTopValue: number
let elementHeightValue: number
let offsetWidthValue: number
const Usermanagement = () => {
  /** *** Responsive Popup Code Start*****/
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const addRemoveuser = useRef(null)
  const usersearch = useRef(null)
  const popupbtnRef = useRef<any>(null)
  const [xpositionvalueupdate, setpopupwidthupdate] = useState<number>()
  const [popupheight, setpopupheight] = useState<number>()
  const [showActionPopups, setShowActionPopups] = useState({
    addRemoveuser: false,
    usersearch: false
  })
  const [btnActionshowhide, setActionbtnshowhide] = useState({
    addRemoveuser: false,
    usersearch: false
  })
  const [selectedRole, setSelectedRole] = useState<string>('All')
  const [roleUsers, setRoleUsers] = useState<Array<ISiteUserInfo>>([])
  const [searchpeople, setsearchpeople] = useState('')
  const [addpeople, setaddpeople] = useState('')
  const [DeleteToggle, setDeleteToggle] = useState(false)
  const [AdduserToggle, setAdduserToggle] = useState(false)
  const [searchdone, setsearchdone] = useState(Boolean)
  const [userexistgroups, setuserexistGroups] = useState<any>([])
  const [groupsToCheck, setgroupsToCheck] = useState<any>([])
  const [searcheduserGroups, setsearcheduserGroups] = useState<any>()
  const [emptysearch, setemptysearch] = useState(false)
  const [addemptysearch, setaddemptysearch] = useState(false)
  const [search, setSearch] = useState(false)
  const [people, setPeople] = useState(false)
  const [inputVal, setInputVal] = useState<string>(null as unknown as string)
  const [addCheckArrayRoles, setaddCheckArray] = useState<any>([])
  const [removeCheckArrayRoles, setremoveCheckArray] = useState<any>([])
  const [checkInputVal, setCheckInputVal] = useState<string>(null as unknown as string)
  const [selectedVal, setSelectedVal] = useState<string>(null as unknown as string)
  const [showRoles, setShowRoles] = useState(false)
  useEffect(() => {
    if (inputVal && checkInputVal && inputVal !== checkInputVal) {
      $('._2z2Tk :input').trigger('focus')
      $('._2z2Tk :input').val(inputVal)
    }
  }, [inputVal])
  
  useEffect(() => {
    setpopupheight(window.innerHeight - (offsetTopValue + 58))
    const popupwidthdata = popupbtnRef.current ? popupbtnRef.current.offsetWidth : 0
    if (popupwidthdata < xpositionvalue) {
      xpositionvalue = xpositionvalue - popupwidthdata
      setpopupwidthupdate(xpositionvalue)
    } else if (popupwidthdata > offsetLeftValue && popupwidthdata < (window.innerWidth - (offsetLeftValue + offsetWidthValue))) {
      xpositionvalue = offsetLeftValue
      setpopupwidthupdate(xpositionvalue)
    } else if (popupwidthdata > offsetLeftValue && popupwidthdata > (window.innerWidth - (offsetLeftValue + offsetWidthValue))) {
      xpositionvalue = 0
      setpopupwidthupdate(xpositionvalue)
    }
  }, [multiplePopup])
  useEffect(() => {
    getUsersfromAllRoles()
  }, [])
  function getUsersfromAllRoles () {
    const allRoles: any = []
    USER_ROLES?.map(async (i) => {
      const rolesgroup = await getUsersfromRole(i)
      allRoles.push({
        role: i,
        roleUsers: rolesgroup
      })
      if (allRoles?.length === USER_ROLES?.length) {
        setRoleUsers(allRoles)
      }
    })
  }
  const showhide = { ...btnActionshowhide }
  function popupCloseOpenFunctionality (type: any, value: boolean, top: number, xposition: number, left: number, elementHeight: number, offsetWidth: number) {
    popupTop = top
    xpositionvalue = xposition
    offsetLeftValue = left
    offsetTopValue = top
    elementHeightValue = elementHeight
    offsetWidthValue = offsetWidth
    showhide.addRemoveuser = false
    showhide.usersearch = false
    setsearchdone(false)
    setDeleteToggle(false)
    setaddpeople('')
    setSearch(false)
    setActionbtnshowhide(showhide)
    if(type === 'addRemoveuser') {
    setemptysearch(false)
    setsearchpeople('')
    setInputVal('')
    }
    if (type === multiplePopup) {
      setMultiplePopup()
    } else if (type) {
      setMultiplePopup(type)
    }
  }
  async function changeUserRole (value: string) {
    setSelectedRole(value)
    getUsersfromAllRoles()
    setaddCheckArray([])
    setremoveCheckArray([])
    // eslint-disable-next-line no-return-assign
    document.querySelectorAll('input[type=checkbox]').forEach((el : any) => el.checked = false)
  }
  const handleSelect = (e: any) => {
    setaddpeople(e.Key)
    setsearchdone(false)
  }
  $('.userroles ._2z2Tk :input').change((e) => {
    setsearchpeople('')
    setemptysearch(false)
  })
  $('.searchUsers ._2z2Tk :input').change((e) => {
    setaddpeople('')
    setSearch(false)
  })
  const searchAddRemoveUsers = async () => {
    const rolesToCheck = selectedRole === 'All' ? USER_ROLES : [selectedRole]
    setgroupsToCheck(rolesToCheck)
    if ($('.searchUsers ._2z2Tk :input').val() === '') {
      setSearch(true)
      setaddpeople('')
    } else {
      setSearch(false)
    }
    setDeleteToggle(false)
    setAdduserToggle(false)
    setaddemptysearch(false)
    setsearchdone(true)
    let userexist = false
    if (addpeople !== '') {
      setaddemptysearch(false)
      const groupss = await getUsersRoles(addpeople)
      const existingGroups: any[] = []
      groupss?.forEach((item: any) => {
        if (rolesToCheck?.includes(item.Title)) {
          existingGroups?.push(item.Title)
          userexist = true
        }
      })
      setuserexistGroups(existingGroups)
    } else {
      setaddemptysearch(true)
    }
  }
  const RemoveUser = () => {
    removeCheckArrayRoles.forEach((selectRole: string) => {
      removeUserFromRole(selectRole, addpeople).then(function () {
        searchAddRemoveUsers()
        changeUserRole(selectedRole)
      })
    })
  }
  const addPeopletoGroup = async () => {
    addCheckArrayRoles.forEach((selectRole: string) => {
      addUserToRole(selectRole, addpeople).then(function () {
        searchAddRemoveUsers()
        changeUserRole(selectedRole)
      })
    })
  }
  const handleSearchpp = (e: any) => {
    setsearchpeople(e?.Key)
    setSelectedVal(e?.Key)
    setInputVal(e?.DisplayText)
    setCheckInputVal(e?.DisplayText)
    setPeople(true)
    setemptysearch(false)
    setMultiplePopup('')
  }
  const getsearchGroups = async () => {
    setsearcheduserGroups(null)
    if ($('.userroles ._2z2Tk :input').val() === '') {
      setemptysearch(true)
      setaddpeople('')
      setMultiplePopup('')
      setShowRoles(false)
    } else {
      setemptysearch(false)
      setShowRoles(true)
    }
    const activegroupsdata: any[] = []
    if (searchpeople !== '') {
      const groupss = await getUsersRoles(searchpeople)
      const groupsdata = groupss
      await groupsdata?.forEach((item: any) => {
        if (USER_ROLES.includes(item?.Title)) {
          activegroupsdata.push(item?.Title)
        }
      })
      setsearcheduserGroups(activegroupsdata)
    }
  }
  const changeMembers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value)
    setsearchpeople(selectedVal)
    setMultiplePopup('')
    setPeople(false)
  }
  const getCheckedGroups = (e : any, isAddCheck : boolean, groupname : string) => {
    let addCheckArray = addCheckArrayRoles; let removeCheckArray = removeCheckArrayRoles
    setAdduserToggle(!AdduserToggle)
    if (e.target.checked) {
      isAddCheck ? addCheckArray.push(groupname) : removeCheckArray.push(groupname)
    } else {
      isAddCheck ? addCheckArray = addCheckArray.filter(function (role: any) { return role !== groupname }) : removeCheckArray = removeCheckArray.filter(function (role: any) { return role !== groupname })
    }
    addCheckArray = Array.from(new Set(addCheckArray))
    removeCheckArray = Array.from(new Set(removeCheckArray))
    addCheckArray?.length > 0 ? setAdduserToggle(true) : setAdduserToggle(false)
    removeCheckArray?.length > 0 ? setDeleteToggle(true) : setDeleteToggle(false)
    setaddCheckArray(addCheckArray)
    setremoveCheckArray(removeCheckArray)
  }
  useEffect(() => {
    const inputElement = document.querySelector('input[type="text"][placeholder="Start typing name or email address..."]')
    if (inputElement) {
      inputElement.setAttribute('id', 'Checkuserpermissions')
    }
  }, [])
  return (
    <div className='container p-0'>
      <div className='row m-0'>
        <div className='shadow card mt-0 p-0 tabscontent-height'>
          <div className="d-flex w-100 p-relative align-items-center flex-wrap p-3 pb-2 ">
            <h2 tabIndex={0} aria-label="Filter By" className="d-flex align-items-center font-14 m-1 ms-0 text-nowrap">
              <span className="icon-filter font-16 pe-1"></span> Filter By:
            </h2>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center ms-1">
                <CustomSelect
                  id='userrole'
                  name='User Role'
                  placeholder='Select'
                  value={[selectedRole]}
                  onChange={(e: any) => changeUserRole(e.value)}
                  label='User Role'
                  type='select'
                  className='font-11 form-lg customselect min-w-120 max-w-120'
                  formClassName="ms-auto form-horizontal"
                  options={[...USER_ROLES]}
                  defaultAll={true}
                />

              </div>
              <div className="d-flex form-vertical form-sm-horizontal justify-content-start align-items-start align-items-sm-center ms-2 p-relative">
              <label tabIndex={0} aria-label='Check user permissions' className='me-1' htmlFor='Checkuserpermissions'>Check user permissions: </label>
              <div className='d-flex flex-column'>
              <div className="d-flex align-items-center min-w-250 min-w-md-300 sppeoplepicker p-unset userroles" onChange={() => setemptysearch(false)}>
              {people
                ? (
                <div>
                <input className='d-flex flex-column w-100' value={inputVal} onChange={(e) => changeMembers(e)} /></div>)
                : (<>
                <SpPeoplePicker className='d-flex flex-column' titleText="People Picker" onSelect={handleSearchpp} onChange={handleSearchpp} onClick={handleSearchpp} />
                </>)
                }
                <ActionButtons
                  label="Search"
                  name='Search'
                  btnclassName='ms-2 maxfitcontent'
                  className={multiplePopup === 'usersearch' && searchpeople !== '' && showRoles ? 'btn-primary whitetext font-0 font-sm-14 btn-border-radius3 p-relative popup-arrow' : 'btn-primary whitetext font-0 font-sm-14 btn-border-radius3 p-relative'}
                  icon="icon-search font-12 me-md-1 bold"
                  isClick='usersearch'
                  type="button"
                  ref={usersearch}
                  popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                  showhide={showActionPopups.usersearch}
                  onClick={getsearchGroups}
                />
                {multiplePopup === 'usersearch' && searchpeople !== ''  && showRoles
                  ? <div className='popup popup-md px-0' ref={popupbtnRef} style={{ top: popupTop + 8, position: 'absolute', left: xpositionvalueupdate, maxHeight: popupheight }}>
                    <div className='d-flex border-bottom2 mb-2 px-2 pb-1'>
                      <h3 tabIndex={0} aria-label='User Roles'>User Roles</h3>
                      <div className='close ms-auto'>
                        <ActionButtons
                          label="Cancel"
                          name=""
                          className='btn-bgcolor6 whitetext p-0 btn btn-sm font-0 btn-border-radius3'
                          icon="icon-close font-8 p-1"
                          type="button"
                          isClick='usersearch'
                          ref={usersearch}
                          popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                          showhide={showActionPopups.usersearch} />
                      </div>
                    </div>
                    <div>
                      <ul className='list-type-none no-border-last-child p-unset m-0 p-0 box-shadow-none w-100'>
                        {searcheduserGroups && searcheduserGroups?.length > 0
                          ? searcheduserGroups?.map((groupname: string) =>
                            <li className='border-bottom2 py-1 px-2' key={groupname}>{groupname}</li>
                          )
                          : searcheduserGroups && <div className='subtitle-color'>
                            There are no results to display.
                          </div>}
                      </ul>
                    </div>
                  </div>
                  : ''}
                  {emptysearch && <div className="errormsg pt-1" >You can&apos;t leave this blank.</div>}
              </div>

              </div>
              </div>
              <div className="font-11 ms-auto" >
                <ActionButtons
                  label="Add / Remove User"
                  name='Add / Remove User'
                  btnclassName='ps-2 border-left2 maxfitcontent'
                  className={multiplePopup === 'addRemoveuser' ? 'btn-border color-primary font-14 btn-border-radius3 p-relative popup-arrow text-nowrap' : 'btn-border color-primary font-14 btn-border-radius3 p-relative text-nowrap'}
                  icon="icon-add font-12 me-md-1 bold"
                  isClick='addRemoveuser'
                  type="button"
                  ref={addRemoveuser}
                  popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                  showhide={showActionPopups.addRemoveuser}
                />
                {multiplePopup === 'addRemoveuser'
                  ? <div className='popup popup-md' ref={popupbtnRef} style={{ top: popupTop + 8, position: 'absolute', left: xpositionvalueupdate, maxHeight: popupheight }}>
                    <div className='d-flex pb-1'>
                      <h3 tabIndex={0} aria-label='Search User'>Search User</h3>
                      <div className='close ms-auto'>
                        <ActionButtons
                          label="Cancel"
                          name=""
                          className='btn-bgcolor6 whitetext p-0 btn btn-sm font-0 btn-border-radius3'
                          icon="icon-close font-8 p-1"
                          type="button"
                          isClick='addRemoveuser'
                          ref={addRemoveuser}
                          popupCloseOpenFunctionality={popupCloseOpenFunctionality}
                          showhide={showActionPopups.addRemoveuser} />
                      </div>
                    </div>
                    <div className="py-3 d-flex align-items-center form-sm sppeoplepicker searchUsers" onChange={() => setSearch(false)}>
                      <SpPeoplePicker className ='d-flex flex-column' onSelect={handleSelect} />
                      <Buttons
                        label="Search"
                        aria-label="Search"
                        icon="icon-search font-12 me-1"
                        className='btn-sm btn-primary whitetext font-14 btn-border-radius mx-1'
                        onClick={searchAddRemoveUsers}
                      />
                    </div>
                    {search && <div className="errormsg pt-1" >You can&apos;t leave this blank.</div>}
                    {addpeople !== '' && searchdone && !addemptysearch
                      ? (<>
                        <div className='border-bottom1 mb-2 py-2'>
                          <div className='subtitle-color1' tabIndex={0} aria-label='Currently Assigned User Role(s)'>
                            Currently Assigned User Role(s)
                              <Tooltip content=" Currently Assigned User Roles" position='top'> <span className='icon-info color-primary ps-1'></span></Tooltip>
                          </div>
                          <div className='d-flex flex-wrap gap-1'>
                          {userexistgroups && userexistgroups?.length > 0
                            ? userexistgroups?.map((groupname: string) =>
                              (
                              <><InputCheck
                                inputProps={{
                                  id: groupname,
                                  name: groupname,
                                  type: 'checkbox',
                                  label: groupname,
                                  className: 'font-12 dark-text'
                                }}
                                formClassName='form-horizontal font-0'
                                className="h-auto my-1"
                                onClick={(e: any) => getCheckedGroups(e, false, groupname)} /></>
                              ))
                            : (
                            <div className='subtitle-color' tabIndex={0} aria-label='There are no results to display.'>
                              There are no results to display.
                            </div>)}

                            <div className={DeleteToggle ? 'border-top2 mt-1 pt-2 w-100' : 'border-top2 mt-1 pt-2 w-100 d-none'}>
                                  <Buttons
                                    label='Remove User'
                                    className='btn-sm ms-auto sourceSansProSemiBold font13 border-radius text-white text-uppercase ms-auto radius4 bgcolor-primary'
                                    onClick={RemoveUser} />
                                </div>
                            </div>
                        </div>
                        <div className='py-2'>
                          <div className='subtitle-color' tabIndex={0} aria-label='User Role(s) Available to assign'>
                            User Role(s) Available to assign
                           <Tooltip content='User Role(s) Available to assign' position="top">  <span className='icon-info color-primary ps-1'></span></Tooltip>
                          </div>

                          <div className='d-flex flex-wrap gap-1'>
                          {groupsToCheck && groupsToCheck?.length > 0 && !groupsToCheck.every((r: any) => userexistgroups.includes(r))
                            ? groupsToCheck?.map((groupname: string) =>
                              !userexistgroups?.includes(groupname) && (
                                <>
                              <InputCheck
                                inputProps={{
                                  id: groupname,
                                  name: groupname,
                                  type: 'checkbox',
                                  label: groupname,
                                  className: 'font-12 dark-text'
                                }}
                                formClassName='form-horizontal font-0'
                                className="h-auto my-1"
                                onClick={(e: any) => getCheckedGroups(e, true, groupname)}
                              />
                              </>
                              ))
                            : (
                            <div className='subtitle-color'>
                              There are no results to display.
                            </div>)}
                            <div className={AdduserToggle ? 'border-top2 mt-1 pt-2 w-100' : 'border-top2 mt-1 pt-2 w-100 d-none'}>
                                <Buttons
                                  label='Add User'
                                  className='btn-sm ms-auto sourceSansProSemiBold font13 border-radius text-white text-uppercase ms-auto radius4 bgcolor-primary'
                                  onClick={addPeopletoGroup} />
                              </div>
                            </div>
                        </div> </>)
                      : ''}
                  </div>
                  : ''}
              </div>
            </div>
          </div>
          <div className='card-body px-0 pb-0 overflow-hidden'>
            <table className='table-bordered w-100'>
              <tr>
                <th className='bgcolor-primary whitetext col-md-5 col-lg-4 min-w-150' tabIndex={0} aria-label='User Roles'>User Roles</th>
                <th className='bgcolor-primary whitetext col-md-7 col-lg-8' tabIndex={0} aria-label='User Information'>User Information</th>
              </tr>
              {roleUsers?.length && roleUsers?.length > 0 && selectedRole === 'All'
                ? roleUsers?.map((roleslist : any) =>
                  (<tr key={roleslist}>
                <th className='segoeui-semibold font-13 title-color' tabIndex={0} aria-label={roleslist.userrole}>{roleslist?.role}</th>
                <td>
                  <ul className='d-flex list-type-none flex-wrap'>
                  {roleslist?.roleUsers?.length && roleslist?.roleUsers?.length > 0
                    ? roleslist?.roleUsers?.map((userinfolist : any) =>
                      <li className='listdots dots-color1 mx-2 my-1 ps-4 pe-2 py-1 border-radius3 bgcolor-primary-light p-relative' tabIndex={0} aria-label={userinfolist.userinfo} key={userinfolist.Title}>{userinfolist.Title}</li>
                    )
                    : ''}
                  </ul>
                </td>
              </tr>)
                )
                : <tr>
                    <th tabIndex={0} aria-label={selectedRole}>{selectedRole}</th>
                    <td>
                    <ul className='d-flex list-type-none flex-wrap'>
                      {roleUsers?.length > 0 && roleUsers.map((roleslist: any) => (
                        <>
                          {roleslist?.roleUsers?.length > 0 && roleslist?.role === selectedRole &&
                            roleslist?.roleUsers.map((userinfolist: any) => (
                              <li className='listdots dots-color1 mx-2 my-1 ps-4 pe-2 py-1 border-radius3 bgcolor-primary-light p-relative' tabIndex={0} aria-label={userinfolist.userinfo}key={userinfolist.Title}>{userinfolist.Title}
                              </li>
                            ))}
                        </>
                      ))}
                    </ul>
                    </td>
                  </tr>
                  }
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Usermanagement
