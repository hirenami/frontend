"use client"

import SearchLayout from "@/components/pages/search_layout"
import SearchPage from "@/components/pages/search"
import { Suspense } from "react"

export default function Component () {
	return (
		<SearchLayout>
			<Suspense fallback={<div>Loading...</div>}>
			<SearchPage />
			</Suspense>
		</SearchLayout>
	)
}