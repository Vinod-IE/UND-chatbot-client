import React, { useContext, useEffect, useRef, useState } from 'react'
import Buttons from '../../../../components/buttons/buttons'
import Cropper from 'react-easy-crop'
import './banner.css'
import { sp } from '@pnp/sp'
import '@pnp/sp/attachments'
import { AttachmentsType, ListNames } from '../../../../configuration'
import { getAllSettings } from '../../../../store/settings/reducer'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import PageOverlay from '../../../../pageoverLay/pageoverLay'
import Noresult from '../../../../components/noresult/noresult'
import { PopupCloseContext } from '../../../../shared/contexts/popupclose-context'
const Banner = (props: any) => {
    const dispatch = useDispatch<AppDispatch>()
    const [imageFile, setImageFile] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [files, setFiles] = useState<any[]>([])
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [pixelCrop, setPixelCrop] = useState({ x: 0, y: 0, width: 0, height: 0 })
    const [saveImg, setSaveImg] = useState<any>()
    const [cropImg, setCropImg] = useState<any>()
    const [previewVal, setPreviewVal] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [data, setData] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { multiplePopup, setMultiplePopup }: any = useContext(PopupCloseContext)
    useEffect(() =>{
        if(previewVal )
            setMultiplePopup()
    },[previewVal])
    useEffect(() => {
        fetchBannerImage()
    }, [])
    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setPixelCrop(croppedAreaPixels)
    }
    const validateFileType = (file: File) => {
        return file.type.startsWith('image/')
    }
    const createImage = (url: string) =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.addEventListener('load', () => resolve(image))
            image.addEventListener('error', (error) => reject(error))
            image.setAttribute('crossOrigin', 'anonymous')
            image.src = url
        })
    const getCroppedImg = async () => {
        const image: any = await createImage(imageFile)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return null
        }
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )
        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                if (file) {
                    setSaveImg(URL.createObjectURL(file))
                    setCropImg(file)
                    resolve(file)
                } else {
                    reject(new Error('Canvas is empty'))
                }
            }, 'image/jpeg')
        })
    }
    const uploadImageToSharePoint = async (file: Blob) => {
        const fileName = `banner_${Date.now()}.jpg`
        const list = sp.web.lists?.getByTitle(ListNames?.LOGO)
        await list.items?.getById(data?.ID).delete()
        const item = await list.items?.add({
            AttachmentsType: AttachmentsType.Banner,
            ItemCreated: new Date(),
            ItemCreatedById: _spPageContextInfo.userId,
        })
        props?.setRefresh((prevRefresh: boolean) => !prevRefresh)
        await item?.item?.attachmentFiles?.add(fileName, file)
        dispatch(getAllSettings({ name: '' }))
        await fetchBannerImage()
    }
    const bannerSubmit = async () => {
        setLoading(true)
        try {
            const croppedImage: any = await getCroppedImg()
            if (croppedImage) {
                await uploadImageToSharePoint(croppedImage)
            }
        } catch (error) {
            console.error('Error uploading image:', error)
        }
        setLoading(false)
    }
    const fetchBannerImage = async () => {
        setLoading(true)
        try {
            const list = sp.web.lists.getByTitle(ListNames?.LOGO)
            const items = await list.items.get()
            const bannerItems = await items.filter(item => item.AttachmentsType === AttachmentsType.Banner)
            setData(bannerItems[0])
            if (bannerItems.length > 0) {
                const attachments = await list.items.getById(bannerItems[0].Id).attachmentFiles.get()
                setFiles(attachments)
            }
        } catch (error) {
            console.error('Error fetching banner image:', error)
        }
        setLoading(false)
    }
    const resetAndCloseModal = () => {
        setImageFile(null)
        setShowModal(false)
    }
    const previewData = () => {
        setPreviewVal(true)
    }
    const previewClose = () => {
        setPreviewVal(false)
    }
    return (
        loading ? (
            <PageOverlay />
        ) : (<div className="row m-0">
            <div className="mt-0 p-0 d-flex flex-wrap tabsheads p-absolute">
                <h2 tabIndex={0} aria-label="Banner" className="segoeui-semibold font-16 title-color">
                    BANNER
                </h2>
            </div>
            <div>
            <span className="segoeui-semibold font-14 title-color">Note:</span>
            <span className='hintmsg'> The Banner will show based on the Project Requirement.</span></div>
            <div className="p-0 settings-main">
                <div className="d-flex flex-column shadow card mb-2 p-3">
                    <div className="d-flex bannerimage">
                        <div className="d-flex flex-column flex-md-row flex-nowrap w-100">
                            <div className="w-100" tabIndex={0} aria-live="polite">
                                {files.length > 0 ? (
                                    <img src={files[0].ServerRelativeUrl} alt="Banner" title="Banner" />
                                ) : (
                                    <div className='min-h-200 d-flex align-items-center justify-content-around'>
                                        <Noresult />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="dividerdashed vertical mx-2 mx-xxl-3 d-none d-md-block"></div>
                        <div className="d-flex align-items-center gap-1 settings-actionbtns mb-1 ms-auto">
                            {files.length > 0 && (<Buttons
                                type="button"
                                label="Preview"
                                aria-label="Preview"
                                icon="icon-noun-preview me-xxl-1 font-10"
                                className="btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap sourcesansprosemibold"
                                onClick={previewData}
                            />)}
                            {previewVal && (
                                <div className="banner-submit-bg" id="pageoverlay">
                                    <div className="Previewbanner-container whitebg border-primary p-2">
                                        <div className="d-flex align-items-center justify-content-between banner-header p-1 color-primary segoeui-semibold font-13 whitebg border-bottom1">
                                            <span tabIndex={0} aria-label="Preview">
                                                Preview
                                            </span>
                                            <Buttons
                                                aria-label="close"
                                                onClick={previewClose}
                                                icon="icon-close font-11"
                                                className="btn-xs ms-auto p-0 color-primary text-nowrap"
                                            />
                                        </div>
                                        <div>
                                            {files.length > 0 && <img src={files[0].ServerRelativeUrl} alt="Banner" title="Banner" />}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {files.length > 0 && (<Buttons
                                label="Change Banner"
                                aria-label="Change Banner"
                                icon="icon-changebanner me-xxl-1 font-12"
                                className="btn-border btn-xs font-0 font-xxl-14 btn-border-radius3 ms-auto color-primary text-nowrap sourcesansprosemibold"
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.click()
                                        setMultiplePopup()                                    }
                                }}
                            />)}
                            {showModal && (
                                <div className="banner-submit-bg" id="pageoverlay">
                                    <div className="banner-container whitebg border-primary p-0">
                                        <div className="d-flex align-items-center justify-content-between banner-header p-2 color-primary segoeui-semibold font-13 whitebg border-bottom1">
                                            <span tabIndex={0} aria-label="Banner">
                                                Banner
                                            </span>
                                            <Buttons
                                                aria-label="close"
                                                onClick={resetAndCloseModal}
                                                icon="icon-close font-11 color-primary"
                                                className="btn-sm p-0"
                                            />
                                        </div>
                                        <div>
                                            <div>
                                                <Cropper
                                                    image={imageFile}
                                                    crop={crop}
                                                    zoom={zoom}
                                                    aspect={18 / 1}
                                                    onCropChange={setCrop}
                                                    onZoomChange={setZoom}
                                                    onCropComplete={onCropComplete}
                                                />
                                            </div>
                                            <div>
                                                <Buttons
                                                    aria-label="close"
                                                    onClick={resetAndCloseModal}
                                                    icon="icon-cancel font-12"
                                                    className="btn-border btn-xs font-0 font-xl-14 btn-border-radius3 ms-auto color-primary text-nowrap sourcesansprosemibold"
                                                />
                                            </div>
                                        </div>
                                        <div className="banner-footer p-2 whitebg d-flex gap-1 w-100">
                                            <Buttons
                                                label="SAVE"
                                                aria-label="save"
                                                onClick={async () => {
                                                    await bannerSubmit()
                                                    setImageFile(null)
                                                    setShowModal(false)
                                                }}
                                                className="btn-sm btn-border font-12 px-2 btn-border-radius3 whitetext btn-primary text-nowrap segoeui-bold ms-auto text-uppercase"
                                                icon="icon-save font-11 pe-1"
                                                type="button"
                                            />
                                            <Buttons
                                                label="Cancel"
                                                aria-label="close"
                                                onClick={resetAndCloseModal}
                                                icon="icon-close font-10 pe-1 color-primary"
                                                className="btn-sm btn-border1 font-12 px-2 btn-border-radius3 darktext text-nowrap segoeui-bold text-uppercase"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                const selectedFile = e.target.files[0]
                                if (validateFileType(selectedFile)) {
                                    setError(null)
                                    setImageFile(URL.createObjectURL(selectedFile))
                                    setShowModal(true)
                                } else {
                                    setError('Invalid file type. Only images are allowed.')
                                }
                            }
                        }}
                    />
                    {error && (
                        <div className="error-message" style={{ color: 'red' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
        )
    )
}

export default Banner
