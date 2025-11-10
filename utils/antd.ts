import { ModalFormProps, ProFormProps, ProTableProps } from "@ant-design/pro-components"

export const INPUT_LETTERS = {
  getValueFromEvent: (e: any) => {
    const trimmedValue = e?.target.value?.trim()
    const nonNumericValue = trimmedValue.replace(/[0-9]/g, '')
    return nonNumericValue
  }
}

export const INPUT_EMAIL = {
  getValueFromEvent: (e: any) => {
    const trimmedValue = e?.target.value?.trim()
    const validEmail = trimmedValue.replace(/[^\w.@+-]/g, '') // Remove characters not allowed in an email address
    return validEmail
  }
}

export const INPUT_NUMBER = {
  getValueFromEvent: (e: any) => {
    const trimmedValue = e?.target.value?.trim()
    const numericValue = trimmedValue.replace(/\D/g, '') // Allow only numeric characters
    return numericValue
  }
}


export const MODAL_FORM_PROPS: ModalFormProps = {
  labelCol: { flex: '110px' },
  layout: 'horizontal',
  width: 800,
  modalProps: {
    destroyOnHidden: true,
    maskClosable: false
  },
  wrapperCol: { flex: 1 },
  autoFocusFirstInput: true,
  preserve: false,
  size: 'large'
}

export const FORM_PROPS: ProFormProps = {
  labelCol: { flex: '80px' },
  layout: 'horizontal',
  wrapperCol: { flex: 1 },
  preserve: false,
  size: 'middle'
}


export const TABLE_PROPS: ProTableProps<any, any> = {
  // scroll: { x: 1200 },
  search: {
    labelWidth: 'auto',
    collapsed: false,
    collapseRender: false,
    span: {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 6,
      xxl: 4
    }
  },
  pagination: {
    defaultPageSize: 20,
    showSizeChanger: true
  }
}
