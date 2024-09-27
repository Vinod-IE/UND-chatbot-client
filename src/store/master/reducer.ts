// base
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// types
import { masterCollection } from '../../shared/types'
// constants
import { FetchStatus } from '../../configuration'
// api
import { masterAPI } from '../../api'

export interface MasterState {
    readonly masterCollection: masterCollection
    readonly status: FetchStatus | null
    readonly error: string | null
}

const initialState: MasterState = {
  masterCollection: {
    allItems: []
  },
  status: null,
  error: null
}

export const getAllMasterData = createAsyncThunk(
  'master/getmasterItems',
  async (_, thunkAPI) => {
    try {
      const response = await masterAPI.fetchAllMasterItems()
      return response
    } catch (error) {
      console.error(error)
    }
  }
)

const requirementsSlice = createSlice({
  name: 'master',
  initialState,
  reducers: {
    updateRequirementInSlice: (state, action) => {
      const updatedRequirement = action.payload.updatedObject
      const indexToUpdate = state.masterCollection.allItems.findIndex(
        (req: any) => req.ItemGUID === updatedRequirement.ItemGUID
      )
      if (indexToUpdate !== -1) {
        state.masterCollection.allItems[indexToUpdate] = updatedRequirement
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMasterData.pending, (state) => {
        state.status = FetchStatus.LOADING
      })
      .addCase(getAllMasterData.fulfilled, (state, action) => {
        state.status = FetchStatus.SUCCESS
        state.masterCollection.allItems = action.payload ? action.payload : []
      })
      .addCase(getAllMasterData.rejected, (state, action) => {
        state.status = FetchStatus.FAILED
        state.error = action.error.message ?? null
      })
  }
})

export const { updateRequirementInSlice } = requirementsSlice.actions
export default requirementsSlice.reducer
