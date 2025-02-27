import {
    CrownIcon,
    EuroIcon,
    HomeIcon,
    PickaxeIcon,
    UsersRoundIcon,
} from "lucide-react"
import Link from "next/link"
// import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"
// import { Button } from "@/components/ui/button"
import { NavButton } from "@/components/NavButton"
import { ModeToggle } from "./ModeToggle"
import { NavButtonMenu } from "./NavButtonMenu"

export function Header() {
    return (
        <header className="sticky top-0 z-20 h-12 animate-slide border-b bg-background p-2">
            <div className="flex h-8 w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <NavButton icon={HomeIcon} label="Home" href="/baselines" />

                    <Link
                        href="/baselines"
                        className="ml-0 flex items-center justify-center gap-2"
                        title="Home"
                    >
                        <h1 className="m-0 mt-1 hidden text-xl font-bold sm:block">
                            Estimation Sheet
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center">
                    <NavButtonMenu
                        icon={CrownIcon}
                        label="Baselines"
                        choices={[
                            { title: "Search Baselines", href: "/baselines" },
                            {
                                title: "New Baseline",
                                href: "/baselines/form",
                            },
                        ]}
                    />

                    <NavButtonMenu
                        icon={PickaxeIcon}
                        label="Competences"
                        choices={[
                            {
                                title: "Search Competences",
                                href: "/competences",
                            },
                            {
                                title: "New Competence",
                                href: "/competences/form",
                            },
                        ]}
                    />

                    <NavButtonMenu
                        icon={UsersRoundIcon}
                        label="Users"
                        choices={[
                            { title: "Search Users", href: "/users" },
                            { title: "New User", href: "/users/form" },
                        ]}
                    />

                    <NavButtonMenu
                        icon={EuroIcon}
                        label="Plans"
                        choices={[
                            { title: "Search Plans", href: "/plans" },
                            { title: "New Plan", href: "/plans/form" },
                        ]}
                    />

                    <ModeToggle />

                    {/* <Button
                        variant="ghost"
                        size="icon"
                        aria-label="LogOut"
                        className="rounded-full"
                        asChild
                    >
                        <LogoutLink>
                            <LogOut />
                        </LogoutLink>
                    </Button> */}
                </div>
            </div>
        </header>
    )
}
