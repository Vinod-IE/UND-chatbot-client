import React, { useContext, useEffect, useState } from 'react'
import Tabs from '../../components/tabs/tabs'
import Listtwo from './listtwo'
import './listview.css'
import Filters from '../../components/filters/filters'
import Kpis from '../../components/kpi/kpi'
import Buttons from '../../components/buttons/buttons'
import Listthree from './listtthree'
import { PageHeader } from '../../layouts/header/page-header'
import { exportToCSV, copyToAction, pnpAdd, generateGUID, compareLastModifiedMaster, fetchMasterDataData } from '../../Global'
import { getAllMasterData } from '../../store/master/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { ListNames } from '../../configuration'
import { Template_LIST_TITLES, db } from '../../localbase'
import { useLocation } from 'react-router-dom'
import PageOverlay from '../../pageoverLay/pageoverLay'
import Alert from '../../components/alert/alert'
import { PopupCloseContext, UserInitalValue } from '../../shared/contexts/popupclose-context'
import InputSearch from '../../utils/controls/input-search'
import Listone from './tablist'
import { Tablerowgap } from '../../components/table/table-rowgap'

const AllRequests = () => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [tableitems, setTableitems] = useState<any>()
  const [masterData, setMasterData] = useState<any>([])
  const [copidData, setCopidData] = useState<any>([])
  const [refresh, setRefresh] = useState<any>([])
  const { multiplePopup, setMultiplePopup }: typeof UserInitalValue = useContext(PopupCloseContext)
  const [onchangecopyTo, setOnchangecopyTo] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState<any>(false)
  const [data, setData] = useState<any>([])
    const [filters, setFilters] = useState({})
    const Filter = (data: any) => {
        setFilters(data)
      }
  const dispatch = useDispatch<AppDispatch>()
  const location : any = useLocation()
  useEffect(() => {
    setMultiplePopup()
     document.title ='Requests'
  }, [activeTab])
  
  useEffect(() => {
      fetchMasterData()
  }, [])
  async function fetchMasterData () {
    try {
      await compareLastModifiedMaster().then(async (localbaseRebuilt: any) => {
        if (localbaseRebuilt) {
          await db.collection(Template_LIST_TITLES.MasterList).get().then((masterData: any) => {
            const Master = masterData[0]
            if (Master) {
              const MasterData = Master?.data
              setMasterData(MasterData)
              setData(MasterData)
            }
            setLoading(false)
          })
        }
        setLoading(false)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  const onClickExportCSV = (e: any) => {
    e.preventDefault()
    exportToCSV(masterData, 'MasterList')
  }
  const onClickAlert = () => {
    setShowAlert('')
  }
  const onClickCopyTo = (e: any) => {
    setOnchangecopyTo(e)
    e.preventDefault()
    let count = 0
    if (copidData?.length > 0) {
      const data = copyToAction(copidData)
      copidData.forEach(async (item: any) => {
        const copyToItems : any = {}
        data.forEach((ele: any) => {
          copyToItems[ele] = (ele === 'ItemCreated' || ele === 'ItemModified')
            ? new Date()
            : (ele === 'ItemCreatedById' || ele === 'ItemModifiedById')
                ? _spPageContextInfo.userId
                : (ele === 'ItemGUID') ? generateGUID() : (ele === 'StatusTitle') ? 'Copied' : item[ele]
        })
        await pnpAdd(ListNames?.MASTERLIST, copyToItems).then(async (data : any) => {
          count = count + 1
          if (copidData?.length === count) {
            setShowAlert (copidData?.length + ' items copied successfully.')
            setCopidData([])
            await dispatch(getAllMasterData())
            await fetchMasterData()
          }
        })
      })
    } else {
      setShowAlert('Select a item to continue.')
    }
  }
  const onChangeCheckBox = (data: unknown) => {
    setCopidData(data)
  }
  
  useEffect(() => {
    dispatch(getAllMasterData())
  }, [refresh])
  useEffect(() => {
    setTableitems([
      {
        tabtitle: 'All Requests',
        // count: data?.length,
        count: 50,
        is_active: activeTab === 0,
        content: (<Listone masterData={data} copyTo={onChangeCheckBox}/>)
      },
      {
        tabtitle: 'Assigned Assets',
        // count: data?.length,
        count: 12,
        is_active: activeTab === 1,
        content: (<Tablerowgap />)
      }
    ])
  }, [data, onchangecopyTo])
  const filtered = (data: any) => {
    setData(data)
  }
  useEffect(() => {
    if (location?.state?.objectId) {
      Filter(location?.state?.objectId)
    }
}, [location.state])

  return (
    <>
      <PageHeader name='Requests'
        icon="icon-requests"
        extras={<>
          <Buttons
            label="Filters"
            icon='icon-filterby font-14 icon-primarycolor me-1 mt-1'
            className='btn-sm font-14 segoeui-semibold whitebg px-1 border-radius maxfitcontent ms-auto'
          />
          </>} />
      <div className='container'>
        <div className='row'>
        <div className='col-12 mt-2'>
            <div className="shadow card w-100 h-100 border-radius3">
              <div className="card-body ">
                <Tabs setActiveTab={(index: any) => { setActiveTab(index) }} items={tableitems} className="latobold darktext px-2" anchorclass="segoeui-semibold font-14 " badge="badge border-radius3 px-1 whitetext" tablistclassName="font-13 overflow-auto" isButtonsClassName="d-flex align-items-center gap-2 ms-auto"
                isButtons={
                  <>
                  <InputSearch
                        inputProps={{
                        arialabel: 'search',
                        placeholder: 'Search...',
                        label: 'true',
                        }}
                        formClassName='min-w-125 max-w-125'
                        className='h-30 border-radius3 w-100'
                        label=""
                        searchgroup='w-100 d-flex align-items-center inputswithicon'
                        icon='icon-search px-2 icon-primarycolor'
                    />
                    <Buttons
                      label="CSV"
                      icon='icon-exportexcel font-14 title-color17 me-1'
                      className=' bordered3 bgcolor-14 btn-sm font-14 segoeui-regular px-2 border-radius maxfitcontent'
                    />
                  </>
                } />
              </div>
            </div>
          </div>
          {/* <div className='col-sm-12 listview-filters order-first order-lg-0'>
            <div className="w-100 h-100 whitebg bordered1">
              <div className='filter-section mb-3'>
                <Filters
                selectedFilters={Filter}
                change={filters}
                masterData={masterData}
                table={true}
                filteredData={filtered}
                page={'list'}
                />
              </div>
              <div className='kpis-section mb-3'>
                <Kpis />
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {loading && <PageOverlay />}
      {showAlert && (
                <Alert message={showAlert} yes='OK' className="alert-info"
                  onClick={onClickAlert}
                  btn1iconclassNmae='icon-checked  font-11 pe-1'
                  btn1className="btn-border-radius3 px-2 btn-primary whitetext segoeui-regular font-12 text-uppercase btn-xs"
                />
              )}
    </>
  )
}
export default AllRequests
