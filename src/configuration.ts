export const USER_ROLES = ['React Dev Members', 'ReactTemplate Owners', 'React Dev Visitors', 'Rhybus Admin']
export const VISIBLE_ROWS = 30 // visible rows for infinite scroll
export const GENERAL_USER_GROUP = 'All Users'
export const VALIDATE_PII_CONTENT  = true
export const VALIDATE_PII_CONTENT_DISCUSSIONS  = true
export const VALIDATE_PII_CONTENT_FILES  = true
export const FullControlUserGroups = ['ReactTemplate Owners', 'ReactTemplate1Int Owners']
export const GENERATE_ACCESS_GROUP = ['Rhybus Admin']
export const UPDATE_BUILD_VERSION = 'Are you sure, you want to update the Build version?'
export const DELETE_MSG = 'Are you sure, you want to delete the selected item?'
export const CLOSE_MSG ='Are you sure you want to close the page?'
export const CALENDAR_EVENT_MSG ='Are you sure, you want to delete this calendar event?'
export const NO_CHANGE_MSG ='No changes detected'
export const SELECT_ITEM ='Select a item to continue'
export const SELECT_ONE_ITEM = 'Please select at least one document to delete'
export const SELECT_TEAM_MEBR = 'Please select at least one team member to delete'
export const DELETE_TEAM_MEBR = 'Are you sure you want to delete the selected team member(s)?'
export const MAX_NUM_FILES = 10
export const MAX_FILE_SIZE = 26214400 // 25 MB
export const ACCEPTABLE_FILE_TYPES = [
  'xlsx', 'xls', 'doc', 'docx', 'ppt', 'pptx',
  'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'msg'
]
export const FILE_CHARACTERS_UNALLOWED = [',', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', 'ʻ', ':', '“', '|', '<', '>', '/', '?', '~']
export const COMMONMETADATA_SELECT_COLUMNS = ['ID','MetaDataType','InternalCode','MetaDataValue','MataDataDescription','AdditionalValue1','AddititonalValue2','AllowEdit','IsArchived','ItemCreatedBy/Title','ItemModifiedBy/Title']
export const OVERRIDE_METADATA = 'Are you sure, you want to override all Metadata?'
export const COMPLETED_MESSAGE = 'Completed'
// Error/Confirmation display messages
export const SELECT_MESSAGE = 'Please select'
export const ENTER_MSG = 'Please enter'
export const SELECT_DATE = 'Please select date'
export const ENTER_MAIL_ID = 'Please eneter valid mail ID'
export const NORESULT = 'There are no results to display'
export const FILENAME_REGEX = /['~#%{}+]|\\.\\.|^\\.|\\.$/
export const UPDATE_ALERT = 'No Changes Detected'
 
// Submission Type Info
export const Submission = {
  SAVE : 'Save',
  SUBMIT : 'Submit'
}

/// / Backend call status
export enum FetchStatus   {
  SUCCESS = 'Success',
  LOADING = 'Loading',
  FAILED = 'Failed'
}

/// / Display types
export const Display = {
  PAGE : 'Page',
  TILE : 'Tile'
}

/// / List Names
export const ListNames = {
  MASTERLIST : 'MasterList',
  DISCUSSION : 'DiscussionsList',
  DOCUMENT_LIBRARY : 'DocumentLibrary',
  TEAMMEMBERS : 'TeamMembersList',
  EMAILLOGLIST : 'EmailLogList',
  HISTORYLIST : 'HistoryList',
  NOTIFICATION : 'Notification',
  ANNOUNCEMENT : 'AnnouncementList',
  KNOWLEDGEGRAPH : 'KnowledgeBaseArticles',
  CALENDAR : 'CalendarList',
  QUICK_LINK : 'QuickLinkList',
  POINT_OF_CONTACT : 'PointOfContactList',
  REVIEW_MEETING_SCHEDULE : 'ReviewMeetingSchedule',
  QANDA : 'QandAList',
  HELPDESK : 'HelpDeskList',
  FEEDBACK : 'FeedBackList',
  POLICY_MEMO : 'PolicyMemoandGuideLines',
  TOOLTIP : 'ToolTipList',
  FEEDBACK_ABOUT_METADATA : 'FeedbackAboutMetadata',
  PIICATEGORY : 'PIICategory',
  PIICATEGORYTYPE : 'PIICategoryType',
  PIIAUDITTRAIL : 'PIIAuditTrailList',
  PII_FORMATS : 'PIIFormates',
  COMMON_METADATA: 'CommonMetaDataList',
  CLASSIFICATION_BANNER: 'ClassificationBanner',
  LOGO: 'LogoList',
  RELEASE_NOTES : 'ReleaseNotes'
}

/// / Sharepoint constants
export const SHAREPOINT_NAV_ICON_STATE = {
  SHOW : 'Show',
  HIDE :'Hide'
}
export const SHAREPOINT_PERMISSION_LEVELS = {
  Contribute : 'Contribute',
  FullControl : 'FullControl',
  Design : 'Design',
  Edit : 'Edit',
  Read : 'Read',
  ViewOnly : 'ViewOnly',
}

export const SHAREPOINT_PERMISSION_LEVELS_IDS = {
  Contribute : 1073741827,
  FullControl : 1073741829,
  Design : 1073741828,
  Edit : 1073741830,
  Read : 1073741826,
  ViewOnly : 1073741924
}
export const COPY_TO = ['PreviousStatusTitle', 'StatusTitle', 'ItemGUID', 'Title', 'AppTitle', 'ItemCreated', 'ItemCreatedById', 'ItemModified', 'ItemModifiedById']
export const NO_OF_ANNOUNCEMENTS_DISPLAY_IN_HOMEPAGE = 3
export const NO_OF_KNOWLEDGEARTICLES_DISPLAY_IN_HOMEPAGE = 4
export const NO_OF_POINTS_OF_CONTACTS_DISPLAY_IN_HOMEPAGE = 3
export const NO_OF_QUICKLINKS_DISPLAY_IN_HOMEPAGE = 10
export const NO_OF_QA_DISPLAY_IN_HOMEPAGE = 3
export const NO_OF_CALENDAR_DISPLAY_IN_HOMEPAGE = 3

// Settings lists configurations
export const ANNOUNCEMENTS_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'IsArchived', 'Description', 'Tags', 'ExpiryDate', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const KNOWLEDGEGRAPH_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'IsArchived', 'Description', 'FY', 'Role', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const QANDA_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'Answer', 'Question', 'IsArchived', 'Description', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const POC_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'ContactName', 'ContactTitle', 'ContactEmail', 'ContactPhone','IsArchived','ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const QUICKLINKS_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'Info', 'URL', 'IsArchived', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const CALENDAR_SELECT_COLUMNS = ['ID', 'Id', 'BannerUrl', 'Category', 'Overbook', 'Created', 'Description', 'EndDate', 'FreeBusy', 'Geolocation', 'Location', 'EventDate', 'Title', 'ItemCreated', 'ItemModified', 'ItemCreatedBy/Title', 'ItemModifiedBy/Title']
export const HELPDESK_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'EmailAddress', 'hoursOfOperation', 'PhoneNo', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const SITE_FEEDBACK_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'Message', 'Subject', 'FeedBackAbout', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const SITE_FEEDBACK_ABOUT_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'IsArchived', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const TOOLTIPS_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'ToolTipID', 'LabelName', 'TooltipDescription', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title']
export const POLICY_MEMO_SELECT_COLUMNS = ['Exists', 'Name', 'ServerRelativeUrl', 'TimeCreated', 'TimeLastModified', 'UniqueId', 'ItemCreatedBy/Title','ItemModifiedBy/Title']
export const BANNER_SELECT_COLUMNS = ['ID','Id','ClassificationMessage','ClassificationColor','TextColor','ItemCreated','ItemModified', 'ItemCreatedBy/Title', 'ItemModifiedBy/Title']
export const LOGO_SELECT_COLUMNS = ['ID', 'Id','AttachmentsType','AttachmentFiles','ItemCreated','ItemModified', 'ItemCreatedBy/Title', 'ItemModifiedBy/Title']
export const RELEASE_NOTES_SELECT_COLUMNS = ['ID', 'Id','IsArchived','VersionName','NewFeatures','ResolvedIssues','KnownIssues','ItemCreated','ItemModified', 'ItemCreatedBy/Title', 'ItemModifiedBy/Title']

// Application lists Configurations
export const MASTERLIST_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'ItemGUID', 'AppID', 'AppTitle', 'StatusCode', 'StatusTitle', 'PreviousStatusCode', 'PreviousStatusTitle', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title', 'filter1', 'filter2', 'filter3', 'filter4', 'filter5','Description']
export const HISTORYLIST_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'ItemGUID', 'AppID', 'StatusCode', 'StatusTitle', 'PreviousStatusCode', 'PreviousStatusTitle', 'Comment', 'Action', 'AssignedTo/Title', 'AssignedTo/Id']
export const DISCUSSIONLIST_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'ItemGUID', 'AppID', 'Subject', 'Comment', 'IsActionComment', 'ParentCommentID', 'UserRole/Id', 'UserRole/Title', 'CommentType', 'DocumentName', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title' ]
export const TEAMMEMBERSLIST_SELECT_COLUMNS = 'ID, Id, Title, ItemGUID, AppID, TeamMembers, TeamMembers/Title, TeamMembers/ID, TeamMembers/EMail'
export const EMAILLOGLIST_SELECT_COLUMNS = ['ID', 'Id', 'Title', 'Role', 'ToUser', 'Action', 'Subject', 'From', 'To', 'ItemCreated', 'ItemCreatedBy/Title', 'ItemModified', 'ItemModifiedBy/Title', 'ItemGUID', 'AppID', 'Body', 'IsMailSent', 'ErrorInformation']
export const DOCUMENT_LIBRARY_SELECT_COLUMNS = 'Exists, Name, ServerRelativeUrl, TimeCreated, TimeLastModified, UniqueId, ItemCreatedBy/Title,ItemModifiedBy/Title'
// Header Values configuration
export const TABLE_HEADERS = ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5', 'Heading 6', 'Heading 7', 'Heading 8', 'Heading 9', 'Heading 10', 'Heading 11', 'Status']


export const STATUS_COLORS_ENUM : any = {
  'Submitted': '#2DACD3',
  'Copied': '#C3711F',
  'Completed': '#3eaa24',
  'Saved' : '#000000'
}
export const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
export const RADIAN = Math.PI / 180
export const AttachmentsType ={
  Banner : 'Banner',
  Logo : 'Logo'
}
export enum DiscussionType {
  PUBLIC = 'Customer',
  PRIVATE = 'Internal'
}