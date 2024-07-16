import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;
  return {
    category: 'Match Experience',
    label: 'Match Experience',
    key: 'match-experience',
    previewSrc: '',
    fields: [
      {
        label: 'Container',
        name: 'container',
        component: 'container',
      },
      {
        component: 'group-list',
        name: 'preselects',
        label: 'Preselected Products',
        itemProps: {
          label: '{{item.product.handle}}',
        },
        description:
          'Only products part of a product grouping will be preselected, using the first variant',
        fields: [
          {
            label: 'Product',
            name: 'product',
            component: 'productSearch',
          },
        ],
      },
      containerSettings(),
    ],
  };
}
