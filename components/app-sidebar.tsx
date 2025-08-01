'use client'

import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { User } from '@/lib/types'
import { SquareArrowUpLeft } from 'lucide-react'
import * as React from 'react'
import { LanguageToggle } from '@/components/lang-toggle'
import Link from 'next/link'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User
}

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex'>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:!p-1.5'
            >
              <Link href='https://github.com/gabwestside' target='_blank'>
                <SquareArrowUpLeft className='!size-5' />
                <span className='text-base font-semibold'>Wstside Inc.</span>
              </Link>
            </SidebarMenuButton>
            <LanguageToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain
          items={[
            {
              title: 'Dashboard',
              url: '#',
              icon: LayoutDashboard,
            },
          ]}
        /> */}
        <NavSecondary className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
