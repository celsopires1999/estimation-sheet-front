import { SearchButton } from "@/components/SearchButton"
import { Input } from "@/components/ui/input"
import Form from "next/form"

type Props = {
    searchText?: string
}

export async function BaselineSearch({ searchText }: Props) {
    return (
        <Form action="/baselines" className="flex items-center gap-2">
            <Input
                type="text"
                name="searchText"
                placeholder="Search Agreements"
                className="w-full"
                defaultValue={searchText}
                autoFocus
            />
            <SearchButton />
        </Form>
    )
}
