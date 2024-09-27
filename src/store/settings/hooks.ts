/* eslint-disable camelcase */
import { useCallback } from 'react'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
// hooks
import { useAppDispatch, useAppSelector } from '../hooks'
// state
import { AppState } from '../index'
// reducers
import { getAllSettings } from './reducer'
// types
import { SettingsCollection } from '../../shared/types'
import { I_Announcement, I_Calendar, I_KnowledgeGraph, I_PointOfContact, I_QandA, I_QuickLink, I_ReviewMeetingSchedule, I_HelpDesk, I_PolicyMemo, I_Banner, I_Logo, I_ReleaseNotes } from '../../shared/interfaces'
import { I_SiteFeedback, I_SiteFeedbackAbout, I_ToolTips } from '../../shared/interfaces/Settings.interface'

export function useGetAllSettings (): SettingsCollection {
  const settings = useAppSelector((state: AppState) => state.settings.settingsCollection)
  return settings
}

export function useGetQuickLinks (): Array<I_QuickLink> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.quickLinks)
  return result
}

export function useGetPOCs (): Array<I_PointOfContact> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.pointsOfContact)
  return result
}

export function useGetReviewMeetingSchedule (): Array<I_ReviewMeetingSchedule> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.reviewMeetingSchedule)
  return result
}

export function useGetCalendar (): Array<I_Calendar> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.calendar)
  return result
}

export function useGetAnnouncements (): Array<I_Announcement> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.announcements)
  return result
}

export function useGetKnowledgeGraphs (): Array<I_KnowledgeGraph> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.knowledgegraphs)
  return result
}
export function useGetAllSettingsData () {
  const result = useAppSelector((state: AppState) => state.settings.status)
  return result
}
export function useGetQandA (): Array<I_QandA> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.qanda)
  return result
}
export function useGetHelpDesk (): Array<I_HelpDesk> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.helpdesk)
  return result
}
export function useGetFeedback (): Array<I_SiteFeedback> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.sitefeedback)
  return result
}
export function useGetTooltip (): Array<I_ToolTips> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.tooltips)
  return result
}
export function useGetPolicyMemo (): Array<I_PolicyMemo> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.policyMemo)
  return result
}
export function useGetFeedbackAbout (): Array<I_SiteFeedbackAbout> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.siteFeedbackAbout)
  return result
}
export function useGetClassifiedText (): Array<I_Banner> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.bannertext)
  return result
}
export function useGetLogo (): Array<I_Logo> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.logo)
  return result
}
export function useGetReleaseNotes (): Array<I_ReleaseNotes> {
  const result = useAppSelector((state: AppState) => state.settings.settingsCollection.releaseNotes)
  return result
}