import { personalInformation } from '@/actions/auth'
import { Button, DatePicker, Form, Input } from '@heroui/react'
import { Users } from '@prisma/client'
import { Typography } from 'antd'
import { FC, useActionState, useEffect, useTransition } from 'react'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { updateProfile } from '@/utils/request'
import { useAppDispatch } from '@/redux/store'
import { setUserData } from '@/redux/slices/userSlice'
import { useSession } from 'next-auth/react'

const PersonalInformation: FC<{ user: Users | undefined }> = ({ user }) => {
  const dispatch = useAppDispatch()
  const [state, action, isPending] = useActionState(personalInformation, {
    errors: {},
    values: {}
  })
  const [_, startTransition] = useTransition()
  const container = 'grid grid-cols-2 gap-3 w-full'
  const { data: session } = useSession()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(() => {
      action(formData)
    })
  }

  const handleUpdate = async () => {
    const res = await updateProfile({ ...state.values, id: session?.user?.id })

    if (res.success) {
      dispatch(setUserData(res.data))
    }
  }

  useEffect(() => {
    if (state.success) {
      handleUpdate()
    }
  }, [state])

  return (
    <div>
      <Typography.Title level={4}>Personal Information</Typography.Title>
      <Form action={action} validationErrors={state?.errors} onSubmit={handleSubmit}>
        <div className={container}>
          <Input
            name="firstName"
            label="First Name"
            size="sm"
            defaultValue={`${user?.firstName}`}
            errorMessage={state?.errors?.firstName?.[0]}
          />
          <Input
            name="lastName"
            label="Last Name"
            size="sm"
            defaultValue={`${user?.lastName}`}
            errorMessage={state?.errors?.lastName?.[0]}
          />
        </div>
        <div className={container}>
          <Input name="username" label="User Name" size="sm" defaultValue={`${user?.username}`} readOnly />
          <Input name="email" label="Email" size="sm" defaultValue={`${user?.email}`} readOnly />
        </div>
        <div className={container}>
          <DatePicker
            name="birthday"
            label="Birthday"
            showMonthAndYearPickers
            size="sm"
            defaultValue={!!user?.birthday ? parseDate(user?.birthday) : undefined}
            isReadOnly={!!user?.birthday}
            maxValue={today(getLocalTimeZone())}
            errorMessage={state?.errors?.birthday?.[0]}
          />
        </div>
        <Button
          type="submit"
          isLoading={isPending}
          fullWidth
          className="mt-7 customButton1"
          variant="shadow"
          radius="sm"
        >
          {isPending ? 'Updating...' : 'Update Information'}
        </Button>
      </Form>
    </div>
  )
}

export default PersonalInformation
