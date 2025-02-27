import { SearchButton } from "@/components/SearchButton"
import { Input } from "@/components/ui/input"
import Form from "next/form"

type Props = {
    searchText?: string
}

export async function CompetenceSearch({ searchText }: Props) {
    return (
        <Form action="/competences" className="flex items-center gap-2">
            <Input
                type="text"
                name="searchText"
                placeholder="Search Competences"
                className="w-full"
                defaultValue={searchText}
                autoFocus
            />
            <SearchButton />
        </Form>
    )
}
