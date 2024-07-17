import {BUTTONS, COLORS, CROP_POSITIONS} from '~/settings/common';
import {containerSettings} from '~/settings/container';

const media = {
  label: 'Media Settings',
  name: 'media',
  description: 'Image settings, video settings, order, aspect ratio',
  component: 'group',
  fields: [
    {
      label: 'Image Settings',
      name: 'image',
      description: 'Image, image position',
      component: 'group',
      fields: [
        {
          label: 'Image Alt',
          name: 'alt',
          component: 'text',
          description:
            'Alt text set in media manager for selected image(s) will take priority. Re-add image(s) if alt text was set in media manager after selection.',
        },
        {
          label: 'Image (tablet/desktop)',
          name: 'imageDesktop',
          component: 'image',
        },
        {
          label: 'Image Crop Position (tablet/desktop)',
          name: 'cropDesktop',
          component: 'select',
          options: CROP_POSITIONS,
        },
        {
          label: 'Image (mobile)',
          name: 'imageMobile',
          component: 'image',
        },
        {
          label: 'Image Crop Position (mobile)',
          name: 'cropMobile',
          component: 'select',
          options: CROP_POSITIONS,
        },
      ],
    },
    {
      label: 'Media Aspect Ratio (tablet/desktop)',
      name: 'aspectDesktop',
      component: 'select',
      options: [
        {label: '3:2', value: 'md:before:pb-[67%]'},
        {label: '4:3', value: 'md:before:pb-[75%]'},
        {label: '5:4', value: 'md:before:pb-[80%]'},
        {label: '8:7', value: 'md:before:pb-[87.5%]'},
        {label: '1:1', value: 'md:before:pb-[100%]'},
        {label: '7:8', value: 'md:before:pb-[114%]'},
        {label: '4:5', value: 'md:before:pb-[125%]'},
        {label: '3:4', value: 'md:before:pb-[133%]'},
        {label: '2:3', value: 'md:before:pb-[150%]'},
      ],
    },
    {
      label: 'Fill Empty Space (tablet/desktop)',
      name: 'fill',
      component: 'toggle',
      description:
        'Fill any vertical empty space with media. Applicable only to tablet and desktop',
      toggleLabels: {
        true: 'On',
        false: 'Off',
      },
    },
    {
      label: 'Media Aspect Ratio (mobile)',
      name: 'aspectMobile',
      component: 'select',
      options: [
        {label: '3:2', value: 'max-md:before:pb-[67%]'},
        {label: '4:3', value: 'max-md:before:pb-[75%]'},
        {label: '5:4', value: 'max-md:before:pb-[80%]'},
        {label: '8:7', value: 'max-md:before:pb-[87.5%]'},
        {label: '1:1', value: 'max-md:before:pb-[100%]'},
        {label: '7:8', value: 'max-md:before:pb-[114%]'},
        {label: '4:5', value: 'max-md:before:pb-[125%]'},
        {label: '3:4', value: 'max-md:before:pb-[133%]'},
        {label: '2:3', value: 'max-md:before:pb-[150%]'},
      ],
    },
  ],
  defaultValue: {
    image: {
      alt: 'Man with backpack crossing the street',
      imageDesktop: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-tn1yJqxNj-8-unsplash.jpg?v=1672787927',
      },
      cropDesktop: 'center',
      imageMobile: {
        src: 'https://cdn.shopify.com/s/files/1/0671/5074/1778/files/mad-rabbit-tattoo-tn1yJqxNj-8-unsplash.jpg?v=1672787927',
      },
      cropMobile: 'center',
    },
    aspectDesktop: 'md:before:pb-[100%]',
    fill: true,
    aspectMobile: 'max-md:before:pb-[100%]',
  },
};

export function Schema({template}: {template: string}) {
  if (template !== 'page') return null;
  return {
    category: 'Match Experience',
    label: 'Match Experience',
    key: 'match-experience',
    previewSrc:
      'https://cdn.shopify.com/s/files/1/0629/5519/2520/files/byob-preview.jpg?v=1715879706',
    fields: [
      media,
      {
        label: 'Section Settings',
        name: 'section',
        component: 'group',
        description: 'Above the fold, full width, full bleed, vertical padding',
        fields: [
          {
            label: 'Above The Fold',
            name: 'aboveTheFold',
            component: 'toggle',
            description: `Sets the heading as H1 and image load as eager`,
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Full Width',
            name: 'fullWidth',
            component: 'toggle',
            description: 'Removes max width of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Full Bleed',
            name: 'fullBleed',
            component: 'toggle',
            description: 'Removes horizontal padding of this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
          {
            label: 'Vertical Padding',
            name: 'verticalPadding',
            component: 'toggle',
            description: 'Adds vertical padding to this section',
            toggleLabels: {
              true: 'On',
              false: 'Off',
            },
          },
        ],
        defaultValue: {
          aboveTheFold: false,
          fullWidth: true,
          fullBleed: true,
          verticalPadding: false,
        },
      },
      containerSettings(),
    ],
  };
}
