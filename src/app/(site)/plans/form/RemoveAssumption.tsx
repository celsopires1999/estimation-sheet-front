/*
This component is a work around for the issue of getting assumption removed with a enter key in the form.
    <Button variant="outline" size="icon" onClick={() => remove(index)}>
        <Trash />
    </Button>
*/

import { Trash } from "lucide-react"

type Props = {
    onClick: () => void
}
export function RemoveAssumption({ onClick }: Props) {
    return (
        <div
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            onClick={() => onClick()}
        >
            <Trash />
        </div>
    )
}
