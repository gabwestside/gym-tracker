'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar'
import * as React from 'react'

export const NavSecondary = ({ ...props }: React.ComponentPropsWithoutRef<typeof SidebarGroup>) => {
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
