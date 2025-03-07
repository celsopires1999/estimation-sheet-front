import { BadgeWithTooltip } from "@/components/BadgeWithTooltip"
import { getPlanTypeDescription, PlanType } from "@/models"

export function PlanBadge({ value }: { value: unknown }) {
    if (typeof value !== "string") {
        return <span></span>
    }

    return (
        <>
            {value.toLowerCase() === PlanType.Definitive ? (
                <BadgeWithTooltip
                    variant="default"
                    text="Portfolio can be used for planning"
                >
                    <span>{getPlanTypeDescription(PlanType.Definitive)}</span>
                </BadgeWithTooltip>
            ) : (
                <BadgeWithTooltip
                    variant="destructive"
                    text="Portfolio is to be used for initial analysis"
                >
                    <span>{getPlanTypeDescription(PlanType.Preliminary)}</span>
                </BadgeWithTooltip>
            )}
        </>
    )
}
