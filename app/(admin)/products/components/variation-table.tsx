import { TVariant, TVariantOption } from '@/lib/types';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { FC } from 'react';

const VariationTable: FC<{ variations: TVariant[] }> = ({ variations }) => {
  const columns: ProColumns<TVariantOption>[] = [
    {
      title: 'Variation Option Name',
      dataIndex: 'variantOptionName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Discounted Price',
      dataIndex: 'discountedPrice',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
    },
    {
      title: 'Coupon',
      dataIndex: 'coupon',
    },
  ];

  return variations?.map((variation) => {
    return (
      <ProTable<TVariantOption>
        key={variation.id}
        rowKey='id'
        headerTitle={variation.name}
        columns={columns?.map((item, idx) => ({ ...item, key: idx, align: 'center' }))}
        search={false}
        options={false}
        pagination={false}
        dataSource={variation.options}
      />
    );
  });
};

export default VariationTable;
