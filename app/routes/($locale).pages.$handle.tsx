import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import type {LoaderFunctionArgs, MetaArgs} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';
import {RenderSections} from '@pack/react';

import {getShop, getSiteSettings} from '~/lib/utils';
import {PAGE_QUERY} from '~/data/queries';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';

export const headers = routeHeaders;

const MATCH_COLLECTION_QUERY = (collectionHandle: string) => `#graphql
query Collection { 
  collection(handle: "${collectionHandle}") {
      id
      title
      description
      image {
        url
        altText
      }
      products(first: 50) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            images(first: 3){
                edges{
                  node{
                    url
                  }
                }
              }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }`;

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;
  const {data} = await context.pack.query(PAGE_QUERY, {
    variables: {handle},
    cache: context.storefront.CacheLong(),
  });
  const isMatchGame = handle === 'match';
  const collections: any = [];
  if (isMatchGame) {
    const collectionsFromCMS =
      data?.page?.sections?.nodes[0]?.data?.collections;
    if (collectionsFromCMS.length > 0) {
      const collectionHandles = collectionsFromCMS.map(
        (collection: any) => collection.collection.handle,
      );
      for (const collectionHandle of collectionHandles) {
        const {collection} = await context.storefront.query(
          MATCH_COLLECTION_QUERY(collectionHandle),
        );
        collections.push(collection);
      }
    }
  }
  if (!data?.page) throw new Response(null, {status: 404});

  const shop = await getShop(context);
  const siteSettings = await getSiteSettings(context);
  const isPolicy = handle?.includes('privacy') || handle?.includes('policy');
  const analytics = {
    pageType: isPolicy ? AnalyticsPageType.policy : AnalyticsPageType.page,
  };
  const seo = seoPayload.page({
    page: data.page,
    shop,
    siteSettings,
  });

  return json({
    analytics,
    page: data.page,
    seo,
    url: request.url,
    collections,
  });
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function PageRoute() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div data-comp={PageRoute.displayName}>
      <RenderSections content={page} />
    </div>
  );
}

PageRoute.displayName = 'PageRoute';
