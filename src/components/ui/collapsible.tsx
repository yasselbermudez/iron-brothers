"use client"

import {type ComponentProps} from "react"
import {CollapsibleTrigger as Trigger,Root,CollapsibleContent as Content} from "@radix-ui/react-collapsible"

function Collapsible({
  ...props
}: ComponentProps<typeof Root>) {
  return <Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: ComponentProps<typeof Trigger>) {
  return (
    <Trigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Content
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
