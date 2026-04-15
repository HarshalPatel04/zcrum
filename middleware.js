import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],

  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (
      auth.userId &&
      !auth.orgId &&
      !req.nextUrl.pathname.startsWith("/onboarding") &&
      req.nextUrl.pathname !== "/"
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (
      auth.userId &&
      auth.orgId &&
      req.nextUrl.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(
        new URL(`/organization/${auth.orgId}`, req.url)
      );
    }
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};