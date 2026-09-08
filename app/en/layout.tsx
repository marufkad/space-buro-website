import SiteLayout from "../SiteLayout";
export const metadata = { icons: { icon: "/favicon.svg" } };
export default function Layout({ children }: { children: React.ReactNode }) { return <SiteLayout lang="en">{children}</SiteLayout>; }
