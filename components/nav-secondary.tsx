'use client'

import * as React from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'

export function NavSecondary({
  ...props
}: React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <ThemeToggle />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
