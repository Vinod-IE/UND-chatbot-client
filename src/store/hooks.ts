import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from './index'

export const useAppDispatch = (): any => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
