import { AnyCnameRecord } from 'dns'

export interface PageHeaderProps {
    subtitle?: any;
    subTitleClass?: string | undefined;
    titleClass?: string | undefined;
    count?: any;
    name: string;
    icon?: any;
    titleExtras?:any;
    titleExtrasClassName?:any;
    titleExtrasColor?:number
    toolTip?: JSX.Element;
    extras?: JSX.Element;
    leftExtras?:JSX.Element;
    masterArray?: any;
}
