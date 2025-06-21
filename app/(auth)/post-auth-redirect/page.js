import { auth0 } from "@/lib/auth0";

import SocialLoginRedirect from "./SocialLoginRedirect";

export const metadata = {
  title: "NeoPod | Login Redirect",
  description: "Redirecting to login page...",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const PostAuthRedirect = async () => {
  const session = await auth0.getSession();

  return <SocialLoginRedirect session={session} />;
};

export default PostAuthRedirect;
