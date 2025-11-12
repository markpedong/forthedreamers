'use client'

import ProTable from '@/components/pro-table'
import { Button } from '@/components/ui/button'
import { Category } from '@/generated/prisma'
import { addCategory, getCategories, updateCategory } from '@/lib/http'
import { formatDate } from '@/lib/utils'
import { INPUT_LETTERS, MODAL_FORM_PROPS } from '@/utils/antd'
import { tryWithToast } from '@/utils/helper'
import { ActionType, ModalForm, ProColumns, ProFormText } from '@ant-design/pro-components'
import { FC, useRef } from 'react'
import { toast } from 'sonner'

const Categories: FC = () => {
  const actionRef = useRef<ActionType>(null)
  const columns: ProColumns<Category>[] = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Created At',
      render: (_, record) => formatDate(record.createdAt)
    }
  ]
  const fetchData = async (params: any) => {
    const res = await tryWithToast(getCategories({...params, isForProducts: false}))

    return {
      data: res?.data ?? [],
      total: res?.total ?? 0
    }
  }

  const handleSubmit = async ({id, name}: {id?: string; name: string}) => {
    const res = await tryWithToast(id ? updateCategory({id, name}) : addCategory(name))

    if (res?.success) {
      toast.success(`${id ? 'Updated' : 'Added'} successfully`)
      actionRef.current?.reload()
      return true
    }
  }

  const renderAddEditCategory = (type: 'ADD' | 'EDIT', record?: Category) => {
    const isEdit = type === 'EDIT'

    return (
      <ModalForm
        {...MODAL_FORM_PROPS}
        title={`${isEdit ? 'Edit' : 'Add'} Category`}
        trigger={<Button>Add Category</Button>}
        labelCol={{flex: '140px'}}
        onFinish={value => handleSubmit({...(isEdit && {id: record?.id}), name: value.name})}
        initialValues={record}
      >
        <ProFormText {...INPUT_LETTERS} name='name' label='Category Name' required />
      </ModalForm>
    )
  }

  return (
    <ProTable<Category>
      rowKey='id'
      headerTitle={renderAddEditCategory('ADD')}
      request={fetchData}
      columns={columns}
      actionRef={actionRef}
    />
  )
}

export default Categories
