import {
  Outlet,
  useMatches,
  ScrollRestoration,
  useNavigation,
} from "react-router";
import { Seo, type SeoHandle } from "@/components/seo";
import OrganizationSchema from "@/components/organization-schema";

export default function RootLayout() {
  const matches = useMatches();
  const lastMatch = matches.at(-1);
  // Only routes without their own <Seo> (currently just unsubscribe) set a
  // `handle.seo`. Rendering a fallback for every route as well would put two
  // titles/descriptions in <head> — with React 19, each <Helmet> renders its
  // tags natively and they aren't deduplicated.
  const seo = (lastMatch?.handle as SeoHandle | undefined)?.seo;

  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  return (
    <>
      {seo && <Seo {...seo} />}
      <OrganizationSchema />
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-transparent">
          <div className="h-full bg-primary animate-pulse transition-all duration-300 ease-out animate-progress" />
        </div>
      )}
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
