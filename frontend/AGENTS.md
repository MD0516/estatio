<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (main)/
      layout.tsx                    # shared header/nav for all main pages
      page.tsx                      # home
      properties/
        page.tsx                    # search/listing page
        new/page.tsx                # post property (reuses PropertyForm)
        [id]/
          page.tsx                  # property detail (SSR/ISR)
          edit/page.tsx             # update property (reuses PropertyForm)
      profile/
        page.tsx                    # profile
        my-listings/page.tsx
        wishlist/page.tsx
        inquiries/page.tsx
    layout.tsx                      # root layout (providers)
  components/
    ui/                             # small reusable primitives
      InputWithIcon.tsx
      Select.tsx
      Button.tsx
    property/
      PropertyCard.tsx              # used in search, my-listings, wishlist
      PropertyForm.tsx              # used by BOTH new/ and [id]/edit/
      PropertyImageUploader.tsx     # used inside PropertyForm
      PropertyFilters.tsx           # used in search page
      SimilarProperties.tsx         # used in detail page
    layout/
      Header.tsx
      Footer.tsx
  context/
    AppContext.tsx
  hooks/
    useAuth.ts
    useProperty.ts
    useWishlist.ts
    useReview.ts
    useInquiry.ts
  lib/
    axios.ts
    queryKeys.ts
    api/
      auth.ts
      property.ts
      wishlist.ts
      review.ts
      inquiry.ts
  types/
    property.ts
    user.ts
  providers/
    QueryProvider.tsx
  styles/
    globals.scss
    _variables.scss
    _themes.scss
    _reset.scss
    _mixins.scss
    _utilities.scss