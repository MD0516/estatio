export const queryKeys = {
    auth: {
        profile: ["auth", "profile"] as const,
    },
    property: {
        all: ["property"] as const,

        detail: (id: number) =>
            ["property", "detail", id] as const,

        search: (filters: object) =>
            ["property", "search", filters] as const,

        byUser: (userId: number) =>
            ["property", "user", userId] as const,

        similar: (id: number) =>
            ["property", "similar", id] as const
    },
    wishlist: {
        all: ["wishlist"] as const,
    },
    review: {
        byProperty: (propertyId: number) =>
            ["review", "property", propertyId] as const,
    },
    inquiry: {
        all: ["inquiry"] as const,
    },
};