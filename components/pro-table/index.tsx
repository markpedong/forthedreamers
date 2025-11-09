import { DATE_FORMAT, TABLE_PROPS } from '@/constants';
import {
  ProColumns,
  ProTable as AntProTable,
  ProFormDateRangePicker,
  ActionType,
  ProFormInstance,
} from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useMemo, useRef } from 'react';
import { SpinnerCustom } from '../reusable/spinner';
import { ProTableProps } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

const ProTable = <T extends Record<string, any>>({
  columns = [],
  exportDataFn,
  rowKey = 'id',
  formRef: externalFormRef,
  actionRef: externalActionRef,
  timeLabel,
  disableTimeFilter = false,
  isLoading = false,
  ...rest
}: ProTableProps<T>) => {
  const internalActionRef = useRef<ActionType>(null);
  const internalFormRef = useRef<ProFormInstance>(null);
  const actionRef = externalActionRef ?? internalActionRef;
  const formRef = externalFormRef ?? internalFormRef;

  const transformedColumns: ProColumns<T>[] = useMemo(() => {
    const base: ProColumns<T>[] = [
      {
        title: timeLabel || 'Date Range',
        dataIndex: 'dateRange',
        order: -1,
        hideInTable: true,
        colSize: 2,
        search: !disableTimeFilter,
        renderFormItem: () => (
          <ProFormDateRangePicker
            dataFormat={DATE_FORMAT}
            placeholder={['Started At', 'Ended At']}
            fieldProps={{
              showTime: true,
              format: DATE_FORMAT,
              disabledDate: (current) =>
                current &&
                (current > dayjs().endOf('day') || current < dayjs().subtract(30, 'day')),
            }}
          />
        ),
      },
      ...columns.map((col) => ({
        ...col,
        search: col.search ? true : false,
      })),
    ];

    return base.map((item) => ({
      ...item,
      align: 'center',
      formItemProps: { labelCol: { span: '120px' } },
    }));
  }, [columns, timeLabel, disableTimeFilter]);

  if (isLoading) return <SpinnerCustom />;

  return (
    <Card>
      <CardContent>
        {
          //@ts-ignore
          <AntProTable<T>
            {...TABLE_PROPS}
            {...rest}
            rowKey={rowKey}
            actionRef={actionRef}
            //@ts-expect-error
            formRef={formRef}
            columns={transformedColumns}
            search={{ collapseRender: false, defaultCollapsed: false }}
            form={{
              initialValues: {
                dateRange: [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')],
                ...(rest.form?.initialValues ?? {}),
              },
            }}
          />
        }
      </CardContent>
    </Card>
  );
};

export default ProTable;
