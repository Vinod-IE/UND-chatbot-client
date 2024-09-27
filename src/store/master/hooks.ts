/* eslint-disable camelcase */
// hooks
import { useAppDispatch, useAppSelector } from '../hooks'
// state
import { AppState } from '../index'
// reducers
import { getAllMasterData } from './reducer'
// types
import { I_Master } from '../../shared/interfaces'

export function useGetAllMasterItems (): Array<I_Master> {
  const master = useAppSelector((state: AppState) => state.master.masterCollection.allItems)
  return master ?? []
}
