import { SearchButton } from "@/components/SearchButton"
import { Input } from "@/components/ui/input"
import Form from "next/form"

type Props = {
    placeholder?: string
    action: string
    searchText?: string
}

export async function ListSearch({ placeholder, action, searchText }: Props) {
    return (
        <Form action={action} className="flex items-center gap-2">
            <Input
                type="text"
                name="searchText"
                placeholder={placeholder}
                className="w-full"
                defaultValue={searchText}
                autoFocus
            />
            <SearchButton />
        </Form>
    )
}
