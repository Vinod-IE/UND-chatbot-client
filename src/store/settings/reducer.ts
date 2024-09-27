// base
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// types
import { SettingsCollection } from '../../shared/types'
// constants
import { FetchStatus } from '../../configuration'
// api
import { settingsAPI } from '../../api'

export interface SettingsState {
    readonly settingsCollection: SettingsCollection
    readonly status: FetchStatus | null
    readonly error: string | null
}

const initialState: SettingsState = {
  settingsCollection: {
    calendar: [],
    quickLinks: [],
    announcements: [],
    pointsOfContact: [],
    knowledgegraphs: [],
    reviewMeetingSchedule: [],
    qanda: [],
    helpdesk: [],
    sitefeedback: [],
    tooltips: [],
    policyMemo: [],
    siteFeedbackAbout: [],
    bannertext: [],
    logo:[],
    releaseNotes: []
  },
  status: null,
  error: null
}

export const getAllSettings = createAsyncThunk(
  'settings/getAllSettings',
  async ({ name } : {name? : any }) => {
    try {
      const data = await settingsAPI.fetchAll(initialState.settingsCollection, name)
      return data
    } catch (error) {
      console.error(error)
    }
  }
)

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllSettings.pending, (state) => {
        state.status = FetchStatus.LOADING
      })
      .addCase(getAllSettings.fulfilled, (state, action) => {
        state.status = FetchStatus.SUCCESS
        state.settingsCollection.calendar = action.payload ? action.payload.calendar : []
        state.settingsCollection.quickLinks = action.payload ? action.payload.quickLinks : []
        state.settingsCollection.announcements = action.payload ? action.payload.announcements : []
        state.settingsCollection.knowledgegraphs = action.payload ? action.payload.knowledgegraphs : []
        state.settingsCollection.pointsOfContact = action.payload ? action.payload.pointsOfContact : []
        state.settingsCollection.reviewMeetingSchedule = action.payload ? action.payload.reviewMeetingSchedule : []
        state.settingsCollection.qanda = action.payload ? action.payload.qanda : []
        state.settingsCollection.helpdesk = action.payload ? action.payload.helpdesk : []
        state.settingsCollection.sitefeedback = action.payload ? action.payload.sitefeedback : []
        state.settingsCollection.tooltips = action.payload ? action.payload.tooltips : []
        state.settingsCollection.policyMemo = action.payload ? action.payload.policyMemo : []
        state.settingsCollection.siteFeedbackAbout = action.payload ? action.payload.siteFeedbackAbout : []
        state.settingsCollection.bannertext = action.payload ? action.payload.bannertext : []
        state.settingsCollection.logo = action.payload ? action.payload.logo : []
        state.settingsCollection.releaseNotes = action.payload ? action.payload.releaseNotes : []
      })
      .addCase(getAllSettings.rejected, (state, action) => {
        state.status = FetchStatus.FAILED
        state.error = action.error.message ?? null
      })
  }
})
// eslint-disable-next-line no-empty-pattern
export const { } = settingsSlice.actions
export default settingsSlice.reducer
