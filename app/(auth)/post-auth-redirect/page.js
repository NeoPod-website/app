import { auth0 } from "@/lib/auth0";

import SocialLoginRedirect from "./SocialLoginRedirect";

const PostAuthRedirect = async () => {
  const session = await auth0.getSession();

  return <SocialLoginRedirect session={session} />;
};

export default PostAuthRedirect;
