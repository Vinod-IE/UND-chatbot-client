export interface optionsTypes {
    readonly value?: string;
    readonly label?: string;
    readonly color?: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
    readonly rating?: string;
  }

export const customSelectOptions : string[]= [
  'All','Option1', 'Option2', 'Option3', 'Option4'
]

export const select1Options: readonly optionsTypes[] = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' }
]

export const select2Options: readonly optionsTypes[] = [
  { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
  { value: 'chocolate', label: 'Chocolate', rating: 'good' },
  { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
  { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' }
]

export const select3Options: readonly optionsTypes[] = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' }
]
