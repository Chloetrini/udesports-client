// import AuthLayout from "@/layouts/AuthLayout";
import SuspenseUI from "@/components/ui/SuspenseUI";
import RootLayout from "@/layouts/RootLayout";
import MainLayout from './main/layout';
import { createBrowserRouter, Navigate } from "react-router";
import { type RouteObject } from "react-router";
import ErrorBoundary from "@/components/error-boundary";
import AdminLayout from "@/layouts/AdminLayout";


const routes = [
    {
        path: "/",
        Component: RootLayout,
        ErrorBoundary: ErrorBoundary,
        hydrateFallbackElement: <SuspenseUI />,
        handle: {
            seo: {
                title: 'UdeSport – Home',
                description: 'Welcome to Ude Sport - Your source for the latest sports transfers and updates.',
            },
        },
        children: [
            {
                Component: MainLayout,
                children: [
                    {

                        index: true,
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/home");
                            return { Component };
                        }
                    },

                    {
                        path: "about",
                        handle: {
                            seo: {
                                title: "About UdeSport",
                                description:
                                    "UdeSport is Nigeria's most prolific football management and development academy — learn about our scouting methodology, staff, and certifications.",
                            },
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/about");
                            return { Component };
                        }
                    },
                     {
                        path: "contact",
                        handle: {
                            seo: {
                                title: "Contact UdeSport",
                                description:
                                    "Get in touch with UdeSport — scouting enquiries, academy questions, or club representation.",
                            },
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/contact");
                            return { Component };
                        }
                    },

                    {
                        path: "players",
                        handle: {
                            seo: {
                                title: "Player Information",
                                description:
                                    "Explore UdeSport's professional football players, profiles, statistics, and transfer information.",
                            },
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/player-information");
                            return { Component };
                        }
                    },

                    {
                        path: "news",
                        handle: {
                            seo: {
                                title: 'News & Transfers',
                                description: 'Transfer updates, trials, and academy news from UdeSport.',
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/articles/news");
                            return { Component };
                        }
                    },
                    {
                        path: "news/:id",
                        handle: {
                            seo: {
                                title: 'News',
                                description: 'Full article — UdeSport News & Transfers.',
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/articles/full-news");
                            return { Component };
                        }
                    },
                    {
                        path: "gallery",
                        handle: {
                            seo: {
                                title: 'Gallery',
                                description:
                                    "Photos and videos from UdeSport's academy sessions, trials, and player placements.",
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/gallery");
                            return { Component };
                        }
                    },
                    {
                        path: "unsubscribe",
                        handle: {
                            seo: {
                                title: 'Unsubscribe',
                                description: 'Unsubscribe from UdeSport newsletter emails.',
                            }
                        },
                        lazy: async () => {
                            const { default: Component } = await import("@/routes/main/unsubscribe");
                            return { Component };
                        }
                    }
                ]
            },
        ],


    },
    // admin routes
    {
        path: "admin",
        Component: AdminLayout,
        hydrateFallbackElement: <SuspenseUI />,
        children: [
            {
                index: true,
                element: <Navigate to="dashboard" replace />,
            },

            {
                path: "dashboard",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Dashboard",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/dashboard");
                    return { Component };
                },
            },

            {
                path: "player-overview",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Player Overview",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/player-overview");
                    return { Component };
                },
            },

            {
                path: "player-overview/add",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Add Player",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/add-player");
                    return { Component };
                },
            },
            {
                path: "player-overview/edit/:id",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Edit Player",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/add-player");
                    return { Component };
                },
            },
            {
                path: "player-overview/view/:id",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Player Details",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/player-view");
                    return { Component };
                },
            },

            {
                path: "gallery",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Gallery",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/gallery");
                    return { Component };
                },
            },

            {
                path: "gallery/upload",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Gallery Upload",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/gallery-upload");
                    return { Component };
                },
            },
            {
                path: "gallery/edit/:id",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Edit Gallery Item",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/gallery-upload");
                    return { Component };
                },
            },

            {
                path: "news",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "News",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/news");
                    return { Component };
                },
            },

            {
                path: "news/article",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "News",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/news-article");
                    return { Component };
                },
            },

            {
                path: "news/article/:id",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Edit Article",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/news-article");
                    return { Component };
                },
            },

            {
                path: "quick-updates",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Quick Updates",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/quick-updates");
                    return { Component };
                },
            },

            {
                path: "testimonials",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Testimonials",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/testimonials");
                    return { Component };
                },
            },

            {
                path: "staff",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Staff",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/staff");
                    return { Component };
                },
            },

            {
                path: "headlines",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Ticker Headlines",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/headlines");
                    return { Component };
                },
            },

            {
                path: "awards",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Award & Certification",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/awards");
                    return { Component };
                },
            },

            {
                path: "settings",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Settings",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/settings");
                    return { Component };
                },
            },

            {
                path: "notifications",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Notifications",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/notification");
                    return { Component };
                },
            },

            {
                path: "login",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Login",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/login");
                    return { Component };
                },
            },

            {
                path: "forgot-password",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Forgot Password",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/forgot-password");
                    return { Component };
                },
            },
            {
                path: "verification",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "Verification",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/verification");
                    return { Component };
                },
            },

            {
                path: "new-password",
                handle: {
                    seo: {
                        noIndex: true,
                        title: "New Password",
                        description:
                            "View and manage your UdeSport account, events, and activities",
                    },
                },
                lazy: async () => {
                    const { default: Component } = await import("@/routes/admin/new-password");
                    return { Component };
                },
            },

        ],
    },

] satisfies RouteObject[];

export const router = createBrowserRouter(routes)
