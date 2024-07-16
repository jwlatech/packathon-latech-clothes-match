import {containerSettings} from '~/settings/container';

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;
  return {
    category: 'Match Experience',
    label: 'Match Experience',
    key: 'match-experience',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/byob-preview.jpg?v=1715879706',
    fields: [containerSettings()],
  };
}
