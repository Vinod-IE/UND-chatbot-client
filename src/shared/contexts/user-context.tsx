import React, { createContext, useEffect, useState } from 'react'
import { sp } from '@pnp/sp'
import { FullControlUserGroups, GENERATE_ACCESS_GROUP } from '../../configuration'
import { loadPageContext } from 'sp-rest-proxy/dist/utils/env'

export const UserDetailsContext = createContext<{
    isSiteAdmin: boolean;
    isOwner: boolean,
    pageContextdets: Record<string, any>,
    isLoading: boolean,
    myRoles: string[],
    roles: Record<string, boolean>,
    isCustomer: boolean
}>({
    isSiteAdmin: false,
    isOwner: false,
    pageContextdets: {},
    isLoading: true,
    myRoles: [],
    roles: {},
    isCustomer: false
})

export const UserDetailsContextProvider = (props: any) => {
    const [isSiteAdmin, setIsSiteAdmin] = useState<boolean>(false)
    const [myRoles, setMyRoles] = useState<string[]>([])
    const [isOwner, setIsOwner] = useState<boolean>(false)
    const [pageContextdets, setpageContextdets] = useState<Record<string, any>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState({})
    const [isCustomer, setIsCustomer] = useState(false)
    useEffect(() => {
        getContext()
    }, [])
    async function getContext() {
        await loadPageContext()
        const pageContext: Record<string, any> = (window as Window)._spPageContextInfo
        setpageContextdets(pageContext)
        getGroups(pageContext)
    }
    const getGroups = async (pageContext: Record<string, any>) => {
        try {
            const groups: any = await sp.web.getUserById(pageContext.userId).groups()
            const roles: Array<string> = Array.from(new Set(groups?.map((v: any) => v.Title)))
            setMyRoles(roles)
            getLoginRole(roles, pageContext)
        } catch (error) {
            console.log('Error fetching user groups:', error)
        }
    }
    const getLoginRole = (roles: string[], pageContext: Record<string, any>) => {
        const roleChecks = [
            { key: 'isSiteAdmin', condition: pageContext?.isSiteAdmin || roles?.some((r: string) => GENERATE_ACCESS_GROUP?.includes(r)) },
            { key: 'isOwner', condition: roles?.some((r: string) => FullControlUserGroups?.includes(r)) }
        ]
        const roleState: Record<string, boolean> = {}
        roleChecks?.forEach((role) => {
            roleState[role.key] = role.condition
        })
        roleState.isCustomer = !roleState.isSiteAdmin && !roleState.isOwner
        setRoles(roleState)
        setIsCustomer(roleState.isCustomer)
        setIsSiteAdmin(roleState.isSiteAdmin)
        setIsOwner(roleState.isOwner)
        setIsLoading(false)
    }

    return (
        <UserDetailsContext.Provider value={{ isSiteAdmin, isOwner, pageContextdets, isLoading, myRoles, roles, isCustomer }}>
            {props.children}
        </UserDetailsContext.Provider>
    )
}