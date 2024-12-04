"use client"

import Layout from "@/components/pages/layout/layout"
import HomePage from "@/components/pages/home"
import { Suspense } from "react"

export default function Component () {
	return (
		<Layout>
			<Suspense >
			<HomePage />
			</Suspense>
		</Layout>
	)
}