import {json, redirect} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from '@shopify/remix-oxygen';
import {AnalyticsPageType, getSeoMeta} from '@shopify/hydrogen';

import {
  customerLoginRegisterAction,
  redirectLinkIfLoggedIn,
} from '~/lib/customer';
import {getAccountSeo} from '~/lib/utils';
import {GuestAccountLayout, Login} from '~/components';

export async function action({request, context}: ActionFunctionArgs) {
  const {session} = context;
  const {data, status} = await customerLoginRegisterAction({request, context});
  const customerAccessToken = data.customerAccessToken;
  if (customerAccessToken) {
    session.set('customerAccessToken', customerAccessToken);
    return json(data, {headers: {'Set-Cookie': await session.commit()}});
  }
  return json(data, {status});
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const redirectLink = await redirectLinkIfLoggedIn({context, params});
  if (redirectLink) return redirect(redirectLink);
  const analytics = {pageType: AnalyticsPageType.customersLogin};
  const seo = await getAccountSeo(context, 'Login');
  return json({analytics, seo});
}

export const meta = ({data}: MetaArgs) => {
  return getSeoMeta(data.seo);
};

export default function LoginRoute() {
  return (
    <GuestAccountLayout>
      <Login />
    </GuestAccountLayout>
  );
}

LoginRoute.displayName = 'LoginRoute';
